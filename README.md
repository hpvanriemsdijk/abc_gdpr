# ABC GDPR
Making your GDPR record keeping pretty awesome

## What is ABC GDPR
Its will ease the pain of keeping your GRDP administration in a sparkling condition, it is at least designed to do so.

## How is it built
ABC GDPR is build on some pretty cool other opensource projects:
* React frontend
* Ant design GUI framefork
* Graph.cool GraphQL backend

## What can it do?
>Note ABC-GDPR is in a pre-alpha stage and under heavy development. I would not advice anyone to do anything serious with ABC-GDPR at this point.

For now ABC GDPR helps with your records of processing activities, and whats's come with it:
* organization
* processes and processing activities
* applications and information

## How to get started
### Prepair
* Download ABC GDPR

### Get the Graph.cool service up and running
* Move into the graphql directory
* Install all dependencies `npm install`
* deploy the graph server `graphcool deploy`
* Take note of the graph server uri's, we need them later
* Create your admin user by typing `graphcool playground` by excecuting the following query
```
mutation{
	signupUser(email:"your@mailadres.com", password:"your personal secret"){id}
}
```

> * you are running your graphQl server in a public cloud instance of Graphcool Inc. Read there documententation on how to get up and running with your local instance.
* In the current versions, there is no authenttication on the backend server. Consider everything you do with AVC-GDPR public for now.

### Get the frond-end up and running
* Move into the client directory
* Install all dependencies `npm install`
* start using npm `npm start`
