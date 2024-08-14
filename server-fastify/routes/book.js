import fs from "node:fs";
import fsp from 'node:fs/promises'
import stream from 'node:stream'
import util from 'util'
import path from "node:path";
import { readDirectory } from "../utils/book.js";
import { expandPath } from "../utils/index.js";

const base_dir = expandPath(process.env.LOCAL_BOOK_DIR || "~/books");

const stat = util.promisify(fs.stat);
const pipeline=util.promisify(stream.pipeline)

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export default async function bookRoutes(fast, options) {
  // switch table
  const coll = fast.mongo.db.collection("books");

  fast.get(
    "/books",
    {
      schema: {
        query: {},
        tags: ["book"],
      },
    },
    async (req, reply) => {
      const books = await coll.find().toArray();

      return { books };
    }
  );

  fast.get(
    "/local-books",
    {
      schema: {
        query: {
          p: { type: "string", description: "Directory path" },
        },
        tags: ["book"],
      },
    },
    async (req, reply) => {
      const relative_path = decodeURIComponent(req.query.p || "");

      const dir = path.join(base_dir, relative_path);

      if (!fs.existsSync(dir)) return { books: [] };

      const books = await readDirectory(dir, relative_path);
      return { books };
    }
  );

  fast.get(
    "/books/:id",
    {
      schema: {
        // description: 'Get one book',
        // summary: 'GET /books/{id}',
        params: {
          id: { type: "string", description: "Book ID" },
        },
        tags: ["book"],
        response: {
          200: {
            type: "object",
            properties: {
              result: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      author: { type: "string" },
                    },
                    required: ["id", "title"],
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const result = await coll.findOne({ id: req.params.id });
        console.log("book: ", result);
        // if (!result) {
        //   reply.code(404).send({ error: 'Book not found' });
        //   return;
        // }
        return { result };
      } catch (err) {
        return err;
        // throw Error('Error: ', err)
      }
    }
  );

  fast.get(
    "/get-raw-book/*",
    {
      schema: {
        params: {
          ['*']: { type: "string", description: "File path" },
        },
        tags: ["book"],
      },
    },
    async (req, reply) => {
      const slug = decodeURIComponent(req.params['*']);
      const filepath = path.join(base_dir, slug);

      try {
        if (fs.existsSync(filepath)) {
          const stats = await stat(filepath);
          const buff = await fsp.readFile(filepath);
          // const fileStream=fs.createReadStream(filepath)

          const filename = path.basename(filepath);

          reply
            .code(200)
            .header("Content-Type", "application/pdf") // todo: guess file mime type
            // .header("Content-Type", "application/octet-stream")
            // .header("Content-Disposition", `inline; filename="${filename}"`)
            .header('Content-Length', stats.size)
            // .send(fileStream);
            .send(buff);
        } else {
          throw Error("file not found");
        }
      } catch (err) {
        // fast.log.error(err)
        reply.code(404).send({ error: err.message });
      }
    }
  );
}
