export function Features({ features }: { features: { title: string; icon: string; description: string }[] }) {
  return (
    <div className="tuwadocs:grid tuwadocs:grid-cols-1 tuwadocs:md:grid-cols-3 tuwadocs:gap-6 tuwadocs:mt-12">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="tuwadocs:p-6 tuwadocs:border tuwadocs:rounded-lg tuwadocs:hover:shadow-lg tuwadocs:transition-shadow"
        >
          <div className="tuwadocs:text-2xl tuwadocs:mb-3">{feature.icon}</div>
          <h3 className="tuwadocs:text-lg tuwadocs:font-semibold tuwadocs:mb-2">{feature.title}</h3>
          <p className="tuwadocs:text-gray-600 tuwadocs:dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
