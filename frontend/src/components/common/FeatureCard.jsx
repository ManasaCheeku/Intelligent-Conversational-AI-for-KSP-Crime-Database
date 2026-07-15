function FeatureCard({ title, description }) {

    return (

        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-xl font-bold">

                {title}

            </h2>

            <p className="mt-4">

                {description}

            </p>

        </div>

    )

}

export default FeatureCard;