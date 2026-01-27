const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://tg_05:300285@cluster0.n1uebie.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Kết nối Database thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

const WorkoutSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    type: String, 
    weight: Number,      // Cân nặng hôm nay
    nutrition: String,   // Ghi chú ăn uống
    cnsFatigue: Number,  
    doms: Number,        
    exercises: [{
        name: String,
        sets: [Number],
        rpe: Number,
        pump: Number,      // Độ "bump"
        connection: Number, // Cảm nhận cơ
        note: String
    }]
});

const Workout = mongoose.model('Workout', WorkoutSchema);

app.post('/api/workouts', async (req, res) => {
    try {
        const newWorkout = new Workout(req.body);
        await newWorkout.save();
        res.status(201).json({ message: "Đã lưu nhật ký thành công!" });
    } catch (err) {
        res.status(400).json({ error: "Lỗi lưu dữ liệu" });
    }
});

app.get('/api/workouts', async (req, res) => {
    try {
        const history = await Workout.find().sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});