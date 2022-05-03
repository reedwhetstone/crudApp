/** @format */

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('database connected');
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'Hr4IJlAsZozsukO1v7gMJ56hJDDuspeQJebV3pXYXYI',
        collections: 1114848,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
}

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * (1000 - 100) + 100) / 10;
    const camp = new Campground({
      author: '6263203d4d2e223283bea1b3',
      images: [
        {
          url: await seedImg(),
          filename: `${sample(descriptors)} ${random1000}`,
        },
        {
          url: await seedImg(),
          filename: `${sample(descriptors)} ${random1000}`,
        },
      ],
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
