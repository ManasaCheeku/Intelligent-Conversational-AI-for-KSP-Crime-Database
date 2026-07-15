import { Link } from "react-router-dom";

function Hero() {

    return (

        <section className="text-center py-24 bg-slate-100">

            <h1 className="text-5xl font-bold text-blue-900">

                AI Powered Crime Intelligence

            </h1>

            <p className="mt-6 text-xl text-gray-600">

                Intelligent FIR Filing • AI Investigation • Crime Analytics

            </p>

            <div className="mt-10">

                <Link
                    to="/login"
                    className="bg-blue-900 text-white px-8 py-4 rounded-lg mr-5">

                    Report Crime

                </Link>

                <Link
                    to="/analytics"
                    className="border border-blue-900 px-8 py-4 rounded-lg">

                    View Analytics

                </Link>

            </div>

        </section>

    )

}

export default Hero;