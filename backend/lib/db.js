import mongoose from "mongoose"

const connect_to_db = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to databse ${con.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`)
        process.exit(1) // Exit the process with failure
    }
}

export default connect_to_db