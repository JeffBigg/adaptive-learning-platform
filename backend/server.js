require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error MongoDB:', err));

// Rutas base
app.get('/', (req, res) => {
  res.send('API adaptativa funcionando');
});

// Importar rutas de módulos
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const activityRoutes = require('./routes/activities');


app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/diagnostic', require('./routes/diagnostic'));
app.use('/api/progress', require('./routes/progress'));
// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});
// Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server en puerto ${PORT}`));