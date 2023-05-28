"use strict";

const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");

const url =
  "https://www.mondelezinternational.com/careers/jobs?term=&countrycode=RO";

const company = { company: "Mondelez" };
let finalJobs = [];

const s = new scraper.Scraper(url);

s.soup.then((response) => {
  const totalJobs = parseInt(
    response.find("p", { class: "results-status" }).text.split(" ")[0]
  );

  const pages = scraper.range(1, totalJobs, 20);

  let fetchData = () => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < pages.length; i++) {
        let pageUrl = `${url}&page=${i + 1}`;

        const s = new scraper.Scraper(pageUrl);
        s.soup.then((response) => {
          const jobs = response.findAll("div", { class: "result" });
          jobs.forEach((job) => {
            let location = job
              .find("p", { class: "subtitle" })
              .find("a")
              .text.split(",");

            const id = uuid.v4();
            const job_title = job.find("a").text;
            const job_link =
              "https://www.mondelezinternational.com" +
              job.find("a").attrs.href;

            let city;

            if (location.length > 1 && location[1].trim() === "Romania") {
              city = location[0].trim();
            } else {
              city = "Romania";
            }

            console.log(job_title + " -> " + city);

            finalJobs.push({
              id: id,
              job_title: job_title,
              job_link: job_link,
              company: company.company,
              city: city,
              country: "Romania",
            });

            if (totalJobs === finalJobs.length) {
              resolve(finalJobs);
            }
          });
        });
      }
    });
  };

  fetchData().then((finalJobs) => {
    console.log("Total jobs: " + finalJobs.length);

    // const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
    // const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

    // let logo = "https://dn9tckvz2rpxv.cloudfront.net/cummins/img4/logo.svg";

    // let postLogo = new scraper.ApiScraper(
    //   "https://api.peviitor.ro/v1/logo/add/"
    // );
    // postLogo.headers.headers["Content-Type"] = "application/json";
    // postLogo.post(JSON.stringify([{ id: "Cummins", logo: logo }]));
  });
});