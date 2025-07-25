const fs = require('fs');
const path = require('path');
const https = require('https');

const MODELS_DIR = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

const mockModels = {
  'model.json': JSON.stringify({
    format: "layers-model",
    generatedBy: "TensorFlow.js",
    convertedBy: "TensorFlow.js Converter",
    modelTopology: {
      keras_version: "2.4.0",
      backend: "tensorflow",
      model_config: {
        class_name: "Sequential"
      }
    },
    weightsManifest: [
      {
        paths: ["weights.bin"],
        weights: [
          {
            name: "dense/kernel",
            shape: [63, 128],
            dtype: "float32"
          }
        ]
      }
    ]
  }, null, 2),
  'labels.json': JSON.stringify([
    "Hello", "Thank You", "Please", "Sorry", "Yes", "No",
    "Good", "Bad", "Help", "Stop", "Go", "Come", "Eat",
    "Drink", "Sleep", "Work", "Home", "School", "Friend",
    "Family", "Love", "Happy", "Sad", "Angry", "Surprised"
  ], null, 2)
};

Object.entries(mockModels).forEach(([filename, content]) => {
  const filepath = path.join(MODELS_DIR, filename);
  fs.writeFileSync(filepath, content);
  console.log(`Created mock model file: ${filename}`);
});

const weightsPath = path.join(MODELS_DIR, 'weights.bin');
const mockWeights = Buffer.alloc(8064, 0); 
fs.writeFileSync(weightsPath, mockWeights);
console.log('Created mock weights file: weights.bin');

console.log('Mock models created successfully!');
console.log('In a real implementation, you would download actual trained models.');
