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
}

main().catch(e => console.error(e))
