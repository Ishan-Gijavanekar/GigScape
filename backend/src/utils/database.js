import mongoose from 'mongoose';

async function connectDb () {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected to host: ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error in connecting to database: ${error}`);
        process.exit(1);
    }
}

export {connectDb};