import { Link } from "react-router-dom";
import FAQSection from "./Faq";

export default function Footer() {
  return (
    <footer className="bg-black mt-[10vw] md:mt-0 text-white py-[3vw] px-[4vw]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-[2vw]">
        {/* FAQ Section */}
        <FAQSection />

        {/* Footer Links */}
        <div className="flex flex-col md:flex-row md:justify-center gap-[1vw] mt-[2vw] border-t border-gray-600 pt-[1.5vw]">
          <Link
            to="/termsAndConditions"
            className="text-white hover:text-gray-300 md:text-[1.1vw] text-[4vw] md:mt-[1vw] mt-[5vw]"
          >
            Terms and Conditions
          </Link> 
          <Link
            to="/RefundsAndCancellation"
            className="text-white hover:text-gray-300 md:text-[1.1vw] text-[4vw] md:mt-[1vw] mt-[5vw]"
          >
            Refunds and Cancellation Policy
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-400 md:text-[0.9vw] md:mt-[1vw] text-[3vw] mt-[10vw]">
          © {new Date().getFullYear()} UrbanLite. All rights reserved.
        </p>  
      </div>
    </footer>
  );
}
