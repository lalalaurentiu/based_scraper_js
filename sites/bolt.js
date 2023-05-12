"use strict";

const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");

let url =
  "https://node.bolt.eu/careers-portal/careersPortal/v3/getJobs/?version=CP.4.07";

const company = { company: "Bolt" };
let finalJobs = [];

const s = new scraper.ApiScraper(url);

s.get()
  .then((response) => {
    const jobs = response.data.jobs;

    jobs.forEach((job) => {
      const locations = job.locations;
      locations.forEach((location) => {
        if (location.country == "Romania") {
          const id = uuid.v4();
          const job_title = job.title;
          const job_link = "https://bolt.eu/en/careers/positions/" + job.id;
          const country = "Romania";
          const city = location.city;

          console.log(job_title + " -> " + city);

          finalJobs.push({
            id: id,
            job_title: job_title,
            job_link: job_link,
            company: company.company,
            country: country,
            city: city,
          });
        }
      });
    });
  })
  .then(() => {
    console.log("Total jobs: " + finalJobs.length);

    const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
    const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

    let logo = "https://bolt.eu/bolt-logo-original-on-white.png";

    let postLogo = new scraper.ApiScraper(
      "https://api.peviitor.ro/v1/logo/add/"
    );
    postLogo.headers.headers["Content-Type"] = "application/json";
    postLogo.post(JSON.stringify([{ id: company.company, logo: logo }]));
  });
