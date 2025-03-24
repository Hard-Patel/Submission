import SQLite from "react-native-sqlite-storage";

// Enable SQLite Promises
SQLite.enablePromise(true);

export interface Post {
  id?: number;
  apiId?: number;
  title: string;
  body: string;
  userId: number;
  isUploaded: boolean;
  createdAt: string;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
}

let database: SQLite.SQLiteDatabase

// Open the database
const getDBConnection = async () => {
  return await SQLite.openDatabase(
    { name: 'socialmedia.db', location: 'default' },
    () => console.log('Database opened successfully'),
    (error) => console.error('Error opening database', error)
  );
};


export const initDatabase = async () => {
  try {
    database = await getDBConnection();

    database.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            userId INTEGER NOT NULL,
            isUploaded INTEGER DEFAULT 1,
            createdAt TEXT NOT NULL,
            tags TEXT,
            reactions TEXT,
            views INTEGER,
            apiId INTEGER
          );`,
        [],
        () => console.log("Posts table created successfully"),
        (_, error: any) => console.error("Error creating posts table", error)
      );
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const savePost = async (
  post: Omit<Post, "id" | "isUploaded">
): Promise<number> => {
  try {
    const [result] = await database.executeSql(
      "INSERT INTO posts (title, body, userId, createdAt, isUploaded, tags, reactions, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        post.title,
        post.body,
        post.userId,
        post.createdAt,
        0,
        JSON.stringify(post.tags || []),
        JSON.stringify(post.reactions || { likes: 0, dislikes: 0 }),
        post.views || 0,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

export const saveApiPosts = async (apiPosts: Post[]) => {
  try {
    const db = await getDBConnection();

    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("DELETE FROM posts WHERE isUploaded = 1", [], () => {
          if (apiPosts.length === 0) {
            resolve();
            return;
          }

          const query = `
            INSERT OR REPLACE INTO posts (
              apiId, title, body, userId, createdAt, isUploaded, tags, reactions, views
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const insertPromises = apiPosts.map((post) => {
            return new Promise<void>((res, rej) => {
              tx.executeSql(
                query,
                [
                  post.id,
                  post.title,
                  post.body,
                  post.userId,
                  post.createdAt,
                  1, // isUploaded
                  JSON.stringify(post.tags),
                  JSON.stringify(post.reactions),
                  post.views,
                ],
                () => res(), // Resolve on success
                (_, error) => {
                  console.error("❌ Error inserting post:", error);
                  rej(error); // Reject on failure
                }
              );
            });
          });

          // Wait for all insert operations to complete
          Promise.all(insertPromises)
            .then(() => {
              resolve();
            })
            .catch(reject);
        });
      });
    });

  } catch (error) {
    console.error("❌ Error saving API posts:", error);
  }
};

export const getUnuploadedPosts = async (): Promise<Post[]> => {
  try {
    const [results] = await database.executeSql(
      "SELECT * FROM posts WHERE isUploaded = 0"
    );
    const posts: Post[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      posts.push(results.rows.item(i));
    }
    return posts;
  } catch (error) {
    throw error;
  }
};

export const markPostAsUploaded = async (id: number) => {
  try {
    await database.executeSql("UPDATE posts SET isUploaded = 1 WHERE id = ?", [
      id,
    ]);
  } catch (error) {
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    await database.close();
  } catch (error) {
    console.error("Error closing database:", error);
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const [results] = await database.executeSql(
      `SELECT * FROM posts ORDER BY createdAt DESC`
    );

    const posts: Post[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const item = results.rows.item(i);
      posts.push({
        id: item.apiId,
        title: item.title,
        body: item.body,
        userId: item.userId,
        isUploaded: Boolean(item.isUploaded),
        createdAt: item.createdAt,
        tags: JSON.parse(item.tags || "[]"),
        reactions: JSON.parse(item.reactions || '{"likes":0,"dislikes":0}'),
        views: item.views || 0,
      });
    }

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
