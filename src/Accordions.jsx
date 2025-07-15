import { useState } from "react"

export function Accordion({ children }) {
  return <div className="space-y-4">{children}</div>
}

export function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all">
      <button
        className="w-full flex justify-between items-center px-5 py-4 text-left text-lg font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-sm text-gray-700 dark:text-gray-300">{answer}</div>
      )}
    </div>
  )
}
