# Vinay Shenoy

## Engineering Lead, Qweebi

Current location: Hyderabad, India (Timezone: UTC+5:30)  
Contact number: \+91-9538122356  
Email: work@vinaysshenoy.com  
Qualification: Bachelor of Computer Science & Engineering

# **SUMMARY**

Generalist software engineer with a keen interest in data modeling, system design, and developer experience. I have a broad range of experience over multiple platforms (consumer facing applications, backend apps, internal dev tools). My current skillset leans heavily towards backend and automation work, and absolutely love the craft of engineering, developer experience, and improving engineering feedback loops.

# **RECENT EXPERIENCE (2015 onwards)**

## **Qweebi (Virtual Learning Machines Pte. Ltd.) /** Engineering Lead

JANUARY 2022 \- OCTOBER 2025,  SINGAPORE

Currently serving as Engineering Lead for the company building a virtual STEM makerspace for schools. As part of my role here, I built  the backend application as well as building tools and pipelines to enable rapid prototyping and releases for the customer product. Here is a high-level glance at the most important things I have accomplished here:

* Built a pipeline to continuously build and deploy a Unity3D WebGL application on pull requests and merges to the repository. This supports ephemeral preview builds on Cloudflare Pages for developers to test out and showcase in-progress work without needing to spend time on building and running locally. This pipeline also removed the need for developers to manually create and package builds for the production releases and let us deliver customer value with as little time spent in grunt work as possible. This resulted in an overall increase of shipping velocity by 5X.  
* Set up an automated pipeline to build and deliver 3D assets on demand via AWS S3 \+ Cloudfront. This allowed building of a lightweight WebGL frontend that could load in 20s instead of 2 minutes, and fetched 3d assets only when needed.  
* Built an automated database migration and schema documentation generation workflow using SchemaSpy. This allowed us to keep DB schema documentation and migration code in sync automatically without needing to manually update docs.  
* Built the backend application for the product in NodeJS/Typescript/PostgreSQL. Handled the design, development, and deployment of the backend application end to end as a single engineer. Apart from building the APIs themselves, this involved setting up Continuous Integration and deployment pipelines, setting up docker builds, working with AWS, etc.  
* Set up a Backend \<\> Hubspot CRM sync workflow using Quartz scheduler to enable faster business development. This removed the need for sales team to generate excel reports manually and have a single consolidated dashboard for customer relations.

Apart from actual engineering work, a lot of my responsibilities here also included engineering leadership work. This included working directly with the founders of the company to do product scoping work, decide on tradeoffs to achieve business outcomes, set up hiring pipelines and processes, etc.

**Platforms and Technologies used:** Unity3D, NodeJS, PostgreSQL, AWS, Docker, Cloudflare, Testcontainers, GitHub Actions, Shell scripting

**Languages:** C\#, Typescript, Kotlin/JVM

---

## **Obvious (Obvious Ventures Pvt. Ltd.) /** Lead Product Engineer

JULY 2018 \- JANUARY 2022,  BENGALURU, INDIA

Lead a small team of mobile engineers of various experience levels building a [mobile client](https://github.com/simpledotorg/simple-android) for [Simple.org](https://www.simple.org/), an open platform for enabling public health officials to better monitor and control non communicable diseases like hypertension and diabetes. While I started out as a senior engineer on the team building features for the app, I gradually grew to a tech lead role and focused more on enabling the rest of the team to deliver better value. The things I am most proud of accomplishing in this role are:

* Built a Gradle build plugin to automatically inject observability into generated code for the mobile app database layer built on [Room](https://developer.android.com/training/data-storage/room/). This allowed us to gather SQLite query performance data across thousands of mobile devices used by healthcare providers in the field and report them to Datadog,  thereby giving us insight for better optimization.  
* [Formalized a process](https://github.com/simpledotorg/simple-android/blob/master/doc/mobius/migrating-to-mobius.md) to migrate application screens written in an RxJava based ad-hoc architecture to one based on [Mobius](https://github.com/spotify/mobius). As part of this initiative, I also wrote a tool to process the codebase and estimate a “complexity” score for each screen for migration, which allowed us to better fit the migration process into our planning schedule based on effort involved. This enabled the team to smoothly migrate the application over to the new architecture with minimal impact to feature delivery over six months.  
* Set up the integration test suite for the mobile app to spin up ephemeral instances of the backend application on Heroku for test runs. This drastically reduced flakiness of the test suite since each test run would receive an isolated instance of the server application while also reducing the amount of work needed on behalf of the backend engineers to clean up data on the development servers generated during the mobile application test runs.  
* Integrated an application localization platform called Transifex into the build, allowing localizers to translate text used in the app and integrate it into the codebase without needing developer effort.

**Platforms and Technologies used:** Android, SQLite, GitHub Actions, Shell scripting

**Languages:** Kotlin/Android, Python

---

| HomeLane.com (Homevista Decor & Furnishings Pvt. Ltd.) / Senior Mobile Engineer SEPTEMBER 2015 \-JULY 2018, BENGALURU, INDIA Joined the company as part of an acquisition as  a mobile engineer maintaining an Android  VR application used for visualizing home interiors in design showrooms. Over the course of this role, I grew to a more generalist engineer, solving a variety of problems that helped the business scale.  Here is a high-level list of accomplishments over the course of this employment: Build an Android 2D room planning application used by home interior designers to create and design arbitrary floor plans which would control a webgl rendered 3D interior scene in real-time on customer laptops via WebSockets. This was integrated with the company’s pricing and inventory catalog systems, and was a game-changer for the company since it allowed them to iterate on high-fidelity designs with customers in real-time with pricing, allowing for drastically shorter sales cycles (\~10 days instead of 4-6 weeks). Built a 3D asset management backend for the 3D art team to use to manage the aforementioned application, including validations and checks to reduce the amount of rework that would normally be needed in the case of manual asset uploads. Built a custom 3D asset delivery format for webgl using Google’s [Flatbuffers library](https://flatbuffers.dev/), optimized for our needs. This significantly reduced the time needed to transfer and load assets into the application (by around 2-3X). Platforms and Technologies used: WebSockets, Android, three.js, Dropwizard, ElectronJS Languages: Kotlin/JVM, JavaScript |
| :---- |

# **PREVIOUS EXPERIENCE (2012 \- 2015\)**

## **doowup (virtuaLABS Software Solutions Pvt. Ltd.) /** Software Engineer

MARCH 2015 \- AUGUST 2015, BENGALURU, INDIA

Joined an early-stage home interior visualization startup as a mobile engineer building an Android version of the webgl based visualization framework. Worked here until it was acquired by HomeLane (see recent experience section) and joined them as part of the acquisition.

---

## **Flipkart (Flipkart Internet Pvt. Ltd.) /** Software Development Engineer

JUNE 2014 \- MARCH 2015, BENGALURU, INDIA

Worked as a product  engineer building features for the eBooks Android reader application.

---

## **Sourcebits (Sourcebits Technologies Pvt. Ltd.) /** Software Engineer

### JUNE 2012- FEBRUARY 2014, BENGALURU, INDIA

Worked as a product engineer building Android mobile applications for various clients.

# **EDUCATION**

## **Manipal Institute Of Technology /** Bachelor of Computer Science & Engineering

### 2008 \- 2012,  Manipal, Karnataka, India