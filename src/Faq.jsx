import { Accordion, AccordionItem } from "./Accordions"

export default function FAQSection() {
  const faqs = [
    {
      question: "How do I book a worker?",
      answer:
        "Just sign up, choose the type of worker you need, and select from the available profiles. Booking takes less than a minute!",
    },
    {
      question: "Are workers verified?",
      answer:
        "Yes, all workers go through ID checks, background verification, and skill assessments before onboarding.",
    },
    {
      question: "What if something goes wrong?",
      answer:
        "We have a responsive support team that can resolve issues, refund bookings, or arrange a replacement worker if needed.",
    },
    {
      question: "Do you offer recurring services?",
      answer:
        "Yes, you can set up weekly, bi-weekly, or monthly recurring services directly from your dashboard.",
    },
    {
      question: "How do you ensure safety and trust?",
      answer:
        "All workers are thoroughly verified, and we collect feedback after every job to maintain quality service.",
    },
  ]

  return (
    <section className="w-full left-[50vw] pt-16  bg-[#000]">
      <div className="max-w-4xl px-4 md:px-6 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Answers to common questions about our worker services.
          </p>
        </div>

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Accordion>
      </div>
    </section>
  )
}
