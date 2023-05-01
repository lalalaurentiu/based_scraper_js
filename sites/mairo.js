"use strict";

const scraper = require("../peviitor_scraper.js");
const uuid = require("uuid");

const url = "https://cariere.mairon.ro"

const company = { company: "Mairon" };
let finalJobs = [];

const s = new scraper.Scraper(url);

s.soup.then((soup) => {
    const jobs = soup.find("div", { id:"jobs_list" }).findAll("div", { class:"col-md-9"});

    jobs.forEach((job) => {
        const id = uuid.v4();
        const job_title = job.find("h3").text.trim();
        const job_link = job.find("a").attrs.href;
        const company = "Mairon";
        const country = "Romania";
        const city = job.find("p").text.trim();

        console.log(job_title + " -> " + city);

        const jobObj = {
            id: id,
            job_title: job_title,
            job_link: job_link,
            company: company,
            city: city,
            country: country,
        };

        finalJobs.push(jobObj);
    });
}).then(() => {
    console.log("Total jobs: " + finalJobs.length);

    const apiKey = "182b157-bb68-e3c5-5146-5f27dcd7a4c8";
    const postPeviitor = scraper.postApiPeViitor(apiKey, finalJobs, company);

    let logo =
      "https://www.mairon.ro/wp-content/uploads/2019/06/logo-mairon.png";

    let postLogo = new scraper.ApiScraper(
      "https://api.peviitor.ro/v1/logo/add/"
    );
    postLogo.headers.headers["Content-Type"] = "application/json";
    postLogo.post(JSON.stringify([{ id: "Mairon", logo: logo }]));
});