import { RadarChart } from "@/components/RadarChart";

const Index = () => {
  // Data from the chart image - segments with filled values in the Prozesse area
  const chartData = [
    { segment: "Qualitätssicherung", value: 0, maxValue: 5 },
    { segment: "Struktur", value: 0, maxValue: 5 },
    { segment: "Best Practices", value: 0, maxValue: 5 },
    { segment: "Vorhandene\nRE-Tools", value: 0, maxValue: 5 },
    { segment: "Integration &\nDokumentation", value: 0, maxValue: 5 },
    { segment: "Entscheidungen &\nArbeitsplanung", value: 0, maxValue: 5 },
    { segment: "Buildout Erstellung &\nSupport", value: 0, maxValue: 5 },
    { segment: "Systematisierung\n& Einführung", value: 0, maxValue: 5 },
    { segment: "Wissensdokumentation &\nWissensweigergabe", value: 0, maxValue: 5 },
    { segment: "Kompetenzaufbau", value: 0, maxValue: 5 },
    { segment: "Management-\nEngagement", value: 0, maxValue: 5 },
    { segment: "Rollen &\nVerantwortlichkeiten", value: 3, maxValue: 5 },
    { segment: "Prozessstellung &\ndokumentation", value: 4, maxValue: 5 },
    { segment: "Schnittstellendefinition &\nZusammenarbeit", value: 4, maxValue: 5 },
    { segment: "Projektcontrolling &\nKommunikation", value: 3, maxValue: 5 },
    { segment: "Vorlagen/Templates", value: 2, maxValue: 5 }
  ];

  const outerLabels = [
    "Standards",
    "Tool Unterstützung", 
    "Unternehmenskultur",
    "Prozesse"
  ];

  return (
    <div className="min-h-screen bg-background">
      <RadarChart 
        data={chartData}
        outerLabels={outerLabels}
        size={700}
      />
    </div>
  );
};

export default Index;
