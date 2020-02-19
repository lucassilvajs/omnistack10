const Dev = require('../models/Dev');
const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        const devExist = await Dev.findOne({github_username});

        if(devExist) {
            return res.json(devExist)
        }

        const response = await axios.get(`https://api.github.com/users/${github_username}`);
        
        const { name = login, avatar_url, bio } = response.data;
    
        techsArr = parseStringAsArray(techs)
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
    
        const dev = await Dev.create({
            name,
            avatar_url,
            bio,
            github_username,
            techs: techsArr,
            location
        });
    
        return res.json(dev)
    },

    async index(req, res) {
        const dev = await Dev.find();
        return res.json(dev);
    }
}