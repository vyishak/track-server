const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_TOKEN');
    res.send({ token });
  } catch (err) {
      return res.status(422).send(err.message);
      // invalid data
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(422).send({ error: "must provide email and password"});
  }
  const user = await User.findOne({ email: email});
  if (!user) {
    return res.status(404).send({ error: 'Email not found' });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_TOKEN');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'invalid password or email'});
  }

});

module.exports = router;