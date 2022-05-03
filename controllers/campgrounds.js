/** @format */

const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// module.exports.renderHome=(req, res) => {
//   const campgrounds=await Campground.find({})
//   res.render('/', { campgrounds });
// }

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewCampForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Campground successfully created!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Campground not found!');
    return res.redirect(`/campgrounds`);
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditCampForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground not found!');
    return res.redirect(`/campgrounds`);
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res) => {
  let campground = await Campground.findById(req.params.id);
  if (req.body.campground.location !== campground.location) {
    let response = await geocoder
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    campground.geometry = response.body.features[0].geometry;
    campground.location = req.body.campground.location;
  }

  campground.title = req.body.campground.title;
  campground.description = req.body.campground.description;
  campground.price = req.body.campground.price;

  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  console.log(req.body);
  req.flash('success', 'Campground successfully updated!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('error', 'Campground successfully deleted!');
  res.redirect('/campgrounds');
};
