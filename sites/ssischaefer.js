"use strict";

const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");

const url = "https://www.ssi-schaefer.com/service/vacancysearch/ro-ro/212960";

const company = { company: "SSISchaefer" };
let finalJobs = [];

const s = new scraper.Scraper(url);

s.soup
  .then((soup) => {
    const jobs = soup.findAll("div", { class: "result" });

    jobs.forEach((job) => {
      const id = uuid.v4();
      const job_title = job.find("h3").text.trim();
      const job_link =
        "https://www.ssi-schaefer.com" + job.find("a").attrs.href;
      const country = "Romania";
      const city = job
        .find("div", { class: "job-list-location" })
        .text.split(":")[1]
        .trim();

      console.log(job_title + " -> " + city);

      finalJobs.push({
        id: id,
        job_title: job_title,
        job_link: job_link,
        country: country,
        city: city,
        company: company.company,
      });
    });
  })
  .then(() => {
    console.log("Total jobs: " + finalJobs.length);

    const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
    const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

    let logo =
      "https://www.ssi-schaefer.com/resource/crblob/480/a14c9a665a8272cc2b80687168a2e3d7/logo-ssi-schaefer-svg-data.svg";

    let postLogo = new scraper.ApiScraper(
      "https://api.peviitor.ro/v1/logo/add/"
    );
    postLogo.headers.headers["Content-Type"] = "application/json";
    postLogo.post(JSON.stringify([{ id: company.company, logo: logo }]));
  });