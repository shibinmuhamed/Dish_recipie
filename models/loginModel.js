const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"please add the user name"],
    },

    email: {
        type:String,
        required:[true,"please add the user email address"],
        unique :[true,"email address already taken"],

    },
    password:{
        type:String,
        required:[true,"please add the password"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
},
{
    timestamps:true,
}
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10); 
    }
    next();
  });


userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password); 
  };
  

module.exports = mongoose.model("User",userSchema);