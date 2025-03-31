import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

class DatabaseConnection {
  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // Configure mongoose settings
    mongoose.set("strictQuery", true); // Ensures only defined schema fields are queried

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully.");
      this.isConnected = true;
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected.");
      this.isConnected = false;
      this.handleDisconnection(); 
    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("❌ MongoDB URI is not defined in .env");
      }

      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
      };

      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      this.retryCount = 0; 
    } catch (error) {
      console.error(error.message);
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(
        `🔄 Retrying connection attempt ${this.retryCount} of ${MAX_RETRIES}`
      );

      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));

      return this.connect(); 
    } else {
      console.error(
        `❌ Failed to connect to MongoDB after ${MAX_RETRIES} attempts.`
      );
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("⚠️ Attempting to reconnect to MongoDB...");
      await this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed due to app termination.");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during database disconnection:", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection?.db?.serverConfig?.host || "Unknown", 
      name: mongoose.connection?.db?.databaseName || "Unknown", 
    };
  }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
