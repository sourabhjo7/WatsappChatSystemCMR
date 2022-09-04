const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  creatorUID: {
    type: String,
  },
  assignedNumber: {
    type: Number,
  },
  appName: {
    type: String,
  },
  apiKey: {
    type: String,
  },
  escalations: {
    type: [Object]
  },
  token: {
    type: String,
  }
});

userSchema.statics.createNewUser = function (currUserRole, firstName, lastName, email, password, role, assignedNumber, appName, apiKey){

  if(currUserRole === "Manager"){
    return this.create({
      firstName,
      lastName,
      email,
      password,
      role,
      assignedNumber,
      appName,
      apiKey
    }).then((data) => {
      return data;
    });
  }else{
    return this.create({
      firstName,
      lastName,
      email,
      password,
      role
    }).then((data) => {
      return data;
    });
  }

}

userSchema.statics.getUserByEmail = function(email) {
  return this.findOne({email})
}

userSchema.statics.getUserById = function(userId) {
  return this.findOne({_id: userId})
}

userSchema.statics.getManagerUserByAppName = function(appName) {
  return this.findOne({appName})
}

userSchema.statics.getUsersByRole = function(role) {
  return this.find({role})
}

userSchema.statics.delUser = function(userId) {
  return this.findByIdAndRemove(userId, (err, data) => {
    return data;
  })
}

module.exports = mongoose.model("User", userSchema);
