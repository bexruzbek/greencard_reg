const path = require('path');
const { Router } = require('express');
const Registration = require('../models/Registration');
const { findOne } = require('../models/Registration');
const router = Router();

// @desc      Page of greencard registration
// @access    Public
router.get('/', (req, res) => {
  try {
    res.render('index', {
      title: 'Greencard Registratsiya'
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      POST to greencard registration
// @access    Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      surname,
      birthday,
      sex,
      country,
      address,
      phone,
      email,
      education,
      familystatus,
      couple,
      childrenCount,
      children
    } = req.body;

    // Photo upload
    if(!req.files){
      return new Error();
    }
    
    const photo = req.files.photo;
    const pasport = req.files.pasport;

    // Make sure the image is a photo
    if(!photo.mimetype.startsWith('image') && !pasport.mimetype.startsWith('image')){
      return new Error();
    }

    // Check the file size of image
    if(photo.size > process.env.MAX_FILE_UPLOAD || pasport.size > process.env.MAX_FILE_UPLOAD){
      return new Error();
    }

    // Create custom filename
    photo.name = `photo_${new Date().getTime()}${path.parse(photo.name).ext}`;
    pasport.name = `photo_${new Date().getTime()}${path.parse(pasport.name).ext}`;

    photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async err =>{
      if(err){
        return err;
      }
    });
    pasport.mv(`${process.env.FILE_UPLOAD_PATH}/${pasport.name}`, async err =>{
      if(err){
        return err;
      }
    });


    const registration = new Registration({
      name,
      surname,
      birthday,
      sex,
      country,
      address,
      phone,
      email,
      education,
      familystatus,
      couple,
      childrenCount,
      children,
      photo: photo.name,
      pasport: pasport.name
    });

    await registration.save((err, itemSaved) => {
      if(err) {
        return err;
      }
      const itemId = itemSaved.yourCode;
      res.redirect('/success-registration/' + itemId);
  });

  } catch (err) {
    console.log(err);
  }
});

// @desc      Page after registration
// @access    Public
router.get('/success-registration/:code', async (req, res) => {
  try {
    const code = req.params.code;
    res.render('success', {
      layout: 'code',
      title: 'Sizning kodingiz',
      code
    });
  } catch (err) {
    console.log(err);
  }

});

// @desc      Checking code
// @access    Public
router.get('/checkingcode', async (req, res) => {
  try {
    res.render('check', {
      layout: 'code',
      title: 'Kodni tekshirish'
    });
    
  } catch (err) {
    console.log(err);
  }

});

// @desc      Checking code
// @access    Public
router.get('/checkerror', async (req, res) => {
  try {
    res.render('checkerror', {
      layout: 'code',
      title: 'Kodni tekshirish'
    });
    
  } catch (err) {
    console.log(err);
  }

});

// @desc      Checking code
// @access    Public
router.post('/check', async (req, res) => {
  try {
    const registration = await Registration.findOne({ yourCode: req.body.code });

    if(!registration){
      res.redirect('/checkerror');
    }

    res.render('checkresult', {
      layout: 'code',
      title: 'Tekshiruv natijasi',
      registration
    });
    
  } catch (err) {
    console.log(err);
  }

});


module.exports = router;