import mongoose from "mongoose";

const connectMongoDB = async () => {
    const dbUrl = "mongodb+srv://spherawold:spherawold@cluster0.kjmzzrn.mongodb.net/"; 
    if (!dbUrl) {
        console.error("MongoDB connection string is not defined in environment variables.");
        return false;
    }

    try {
         await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully");
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
};

export default connectMongoDB;
