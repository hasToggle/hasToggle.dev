import "server-only";

import { MongoClient } from "mongodb";
import { keys } from "./keys";

const globalForKnowledge = global as unknown as {
  knowledgeClient?: MongoClient;
};

const getKnowledgeClient = () => {
  if (!globalForKnowledge.knowledgeClient) {
    globalForKnowledge.knowledgeClient = new MongoClient(
      keys().KNOWLEDGE_MONGODB_URI
    );
  }
  return globalForKnowledge.knowledgeClient;
};

export const getKnowledgeDb = () =>
  getKnowledgeClient().db(keys().KNOWLEDGE_MONGODB_DB ?? "knowledge");
