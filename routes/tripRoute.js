import express from 'express'
import axios from 'axios';
import provinceModel from '../model/provincesSchema.js';
const Router = express.Router();
const mapQuestKey = `3DwwGLfhu0C1GkRoefLzhcTJ5VK8pAyH`
Router.get("/", async (req, res) => {

  if (!req.query.start || !req.query.end || req.query.start.length == 0 || req.query.end.length == 0) {
    return res.json({
      status: 404,
      message: "Missing location",
      data: null
    })
  }
  let startLoc = removeCityPrefix(req.query.start)
  let endLoc = removeCityPrefix(req.query.end)
  const response = await axios.get(`https://www.mapquestapi.com/directions/v2/route?key=${mapQuestKey}&from=${startLoc}&to=${endLoc}&unit=k&disallows=Country+Border+Crossing`)
  const route = response.data
  if (!route || route.info.statuscode != 0) {
    return res.json({
      status: 404,
      message: "We are unable to route with the given locations",
      data: null
    })
  }
  let cityRoute = new Set()
  let queries = splitLocationsToQueryString(route.route.legs[0].maneuvers)
  for (let query of queries) {
    const cityResponse = await axios.get(`https://www.mapquestapi.com/geocoding/v1/batch?key=${mapQuestKey}${query}`)
    const cityList = cityResponse.data.results
    for (let city of cityList) {
      let cityName = city.locations[0].adminArea4
      if (city.locations[0].adminArea1 != "VN")
        continue
      if (!cityRoute.has(JSON.stringify({
        _id: "temp",
        label: cityName,
        image: "image"
      })))
        cityRoute.add(JSON.stringify({
          _id: "temp",
          label: cityName,
          image: "image"
        }))
    }
  }
  cityRoute = await Promise.all(Array.from(cityRoute).map(async (jsonString) =>  {
    let cityObj = JSON.parse(jsonString)
    const cityName = cityObj.label
    const province = await provinceModel.findOne({name: cityName}).exec()  
    return {
      _id: province._id,
      label: cityName,
      image: "image"
    }
  }))

  delete route.route.legs
  delete route.route.locations
  delete route.route.options
  delete route.info

  route.cityRoute = splitRoute(cityRoute)
  res.json({
    status: 200,
    message: "OK",
    data: route
  })
})
function removeCityPrefix(cityName) {
  const prefixes = ['Tỉnh', 'Thành phố'];
  const pattern = new RegExp('^(' + prefixes.join('|') + ')\\s*', 'i');
  const cleanedName = cityName.replace(pattern, '');
  return cleanedName;
}

function splitLocationsToQueryString(locations) {
  const result = [];
  const chunkSize = 99;
  for (let i = 0; i < locations.length; i += chunkSize) {
    const chunk = locations.slice(i, i + chunkSize);
    const queryString = chunk
      .map(location => `&location=${location.startPoint.lat},${location.startPoint.lng}`)
      .join("");

    result.push(queryString);
  }
  return result;
}
function splitRoute(cityRoute) {
  let result = []
  const chunk = 7
  if (cityRoute.length <= chunk)
    return [cityRoute]
  const size = Math.ceil(cityRoute.length / chunk)

  let idx = 0
  for (let i = 0; i < size; i++) {
    const splitCities = cityRoute.slice(idx, Math.ceil(cityRoute.length / size) + idx)
    idx += Math.ceil(cityRoute.length / size)
    result.push(splitCities)
  }
  return result
}
export default Router;