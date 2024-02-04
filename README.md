# Lucito

## About
Lucito is a food ordering application written in TypeScript + Express. A robust, secure, and a scalable backend with following features:
1. Ordering food
2. Onboarding multiple vendors
3. Searching the restaurants nearby based on the pincode
4. Authentication using JWT
5. OTP verification using [Twilio](https://www.twilio.com/en-us)
6. Deployment using [fly.io](https://fly.io)

## Environment Variables in Use Today

The application currently has 6 environment variables:

1. `MONGO_DB_URI`

   - **What it is**: MongoDB database link.
   - **Where it comes from**: [MongoDB](https://cloud.mongodb.com/v2/) -> Login -> Your project -> Database Deployments -> Cluster -> Drivers -> ```3. Add your connection string into your application code```

2. `JWT_AUTH_SECRET`

   - **What it is**: A JWT secret for authentication.

3. `TWILIO_ACCOUNT_SID`

   - **What it is**: Twilio account SID
   - **Where it comes from**: [Twilio console](https://console.twilio.com) -> Login -> Your project -> Node.JS -> ```accountSid```

4. `TWILIO_AUTH_TOKEN`

   - **What it is**: Auth token provided by Twilio
   - **Where it comes from**: [Twilio console](https://console.twilio.com) -> Login -> Your project -> Node.JS -> Check ```Show auth token``` -> ```authToken```

5. `PORT`

   - **What it is**: Port on which backend should run in your machine.

## Deployments:

1. [Postman Workspace](https://www.postman.com/lucikritz/workspace/lucito/overview)
2. [Link](https://lucito-lively-grass-7939.fly.dev/)
