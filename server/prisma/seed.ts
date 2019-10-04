import { prisma } from '../src/generated/prisma-client'

async function main() {
  await prisma.createQualityAttribute({
    name: "Integrity", 
    description: "Maintaining and assuring the accuracy and completeness of data over its entire lifecycle",
    appliesToObject: "DATA",
    classificationLabels: {
      create: [
        { score: 0, label: "Low", criteria: "Low" },
        { score: 1, label: "Medium", criteria: "Low" },
        { score: 2, label: "High", criteria: "Low" },
      ]
    }
  })

  await prisma.createQualityAttribute({
    name: "Confidentiality", 
    description: "The property, that information is not made available or disclosed to unauthorized individuals, entities, or processes.",
    appliesToObject: "DATA",
    classificationLabels: {
      create: [
        { score: 0, label: "Low", criteria: "Low" },
        { score: 1, label: "Medium", criteria: "Low" },
        { score: 2, label: "High", criteria: "Low" },
      ]
    }
  })

  await prisma.createQualityAttribute({
    name: "Availability", 
    description: "For any information system to serve its purpose, the information must be available when it is needed.",
    appliesToObject: "APPLICATION",
    classificationLabels: {
      create: [
        { score: 0, label: "Low", criteria: "Low" },
        { score: 1, label: "Medium", criteria: "Low" },
        { score: 2, label: "High", criteria: "Low" },
      ]
    }
  })

  await prisma.createQualityAttribute({
    name: "Privacy", 
    description: "The level of privacy sensitivity level.",
    appliesToObject: "DATA",
    classificationLabels: {
      create: [
        { score: 0, label: "Non personal data", criteria: "Data is not resolvable to a person" },
        { score: 1, label: "Normal personal data", criteria: "Data is resolvable to a person" },
        { score: 2, label: "Sensitive personal data", criteria: "Data is resolvable to a person and might have big impact on the personal live of a data subject." },
      ]
    }
  })

  await prisma.createLegalGround({
    name: "Consent", 
    description: "The individual has given clear consent for you to process their personal data for a specific purpose.",
    specialCategoryCondition: false,
  })

  await prisma.createLegalGround({
    name: "Contract", 
    description: "the processing is necessary for a contract you have with the individual, or because they have asked you to take specific steps before entering into a contract.",
    specialCategoryCondition: false,
  })

  await prisma.createLegalGround({
    name: "Legal obligation", 
    description: "the processing is necessary for you to comply with the law (not including contractual obligations).",
    specialCategoryCondition: false,
  })

  await prisma.createLegalGround({
    name: "Vital interests", 
    description: "The processing is necessary to protect someone’s life.",
    specialCategoryCondition: false,
  })

  await prisma.createLegalGround({
    name: "Public task", 
    description: "The processing is necessary for you to perform a task in the public interest or for your official functions, and the task or function has a clear basis in law.",
    specialCategoryCondition: false,
  })

  await prisma.createLegalGround({
    name: "Legitimate interests", 
    description: "The processing is necessary for your legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect the individual’s personal data which overrides those legitimate interests. (This cannot apply if you are a public authority processing data to perform your official tasks.).",
    specialCategoryCondition: true,
  })
}

main().catch(e => console.error(e))
