const { Router } = require('express');
const Registration = require('../models/Registration');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const out = require('../middleware/notauth');
const auth = require('../middleware/auth')
const router = Router();

// @desc      Admin page
// @access    Private
router.get('/panel', auth, async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.render('admin/index', {
      layout: 'admin',
      title: 'Admin panel',
      registrations: registrations.reverse()
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      GET Admin registrations
// @access    Private
router.get('/registration-admin-green-card', out, async (req, res) => {
  try {
    res.render('admin/reg', {
      layout: 'admin',
      title: 'Admin panel'
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      POST Admin registrations
// @access    Private
router.post('/registration-admin-green-card', out, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const candidate = await Admin.findOne({email});

    if(candidate){
      res.redirect('/admin/registration-admin-green-card');
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const admin = new Admin({ email, password: hashPassword, name });
      await admin.save();
      res.redirect('/admin/login-to-admin');
    }
  } catch (err) {
    console.log(err);
  }
});

// @desc      GET Admin login page
// @access    Private
router.get('/login-to-admin', out, async (req, res) => {
  try {
    res.render('admin/login', {
      layout: 'admin',
      title: 'Admin panel'
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      POST Admin login page
// @access    Private
router.post('/login-to-admin', out, async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Admin.findOne({ email });

    if(candidate) {
      const checkPassword = await bcrypt.compare(password, candidate.password);

      if(checkPassword) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if(err) {
            return err;
          } else {
            res.redirect(`${process.env.BASE_URL}/admin/panel`);
          }
          });
      } else {
        res.redirect('/admin/login-to-admin');
      }
    } else {
      res.redirect('/admin/login-to-admin');
  }

  } catch (err) {
    console.log(err);
  }
});

// @desc      GET Admin logout
// @access    Private
router.get('/logout', async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
  })
  } catch (err) {
    console.log(err);
  }
});

// @desc      Reg order page
// @access    Private
router.get('/panel/:yourCode', auth, async (req, res) => {
  try {
    const registration = await Registration.findOne({ yourCode: req.params.yourCode });
    const url = `${process.env.BASE_URL}/uploads`;

    res.render('admin/order', {
      layout: 'admin',
      title: 'Admin panel',
      registration,
      url
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      PUT to change status
// @access    Private
router.post('/panel/:yourCode', auth, async (req, res) => {
  try {
    const {regId, yourCode} = req.body;
    delete req.body.regId;
    const registration = await Registration.findByIdAndUpdate(regId, req.body, {
      runValidators: false,
      new: true
    });
    res.redirect('/admin/panel');
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;