module.exports = {
  Username: /^[a-zA-Z0-9]{5,20}$/,
  Password: /^[a-zA-Z0-9!@#$%^&*()_+-=`~\\|,.<>'"]{6,20}$/,
  Email: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
};
