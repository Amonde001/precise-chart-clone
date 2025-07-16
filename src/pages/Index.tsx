import { RadarChart } from "@/components/RadarChart";

const Index = () => {
  // Exact data structure based on your specifications with 16 criteria arranged clockwise
  const chartData = [
    // Standards quadrant (top-right) - clockwise from top
    { segment: "Qualitätskriterien", value: 0, maxValue: 5 },
    { segment: "Struktur", value: 0, maxValue: 5 },
    { segment: "Best Practices", value: 0, maxValue: 5 },
    { segment: "Vorhandene\nRE-Tools", value: 0, maxValue: 5 },
    
    // Tool-Unterstützung quadrant (bottom-right) - clockwise
    { segment: "Integration &\nDatenaustausch", value: 0, maxValue: 5 },
    { segment: "Funktionalitäten &\nAnpassungsfähigkeit", value: 0, maxValue: 5 },
    { segment: "Benutzerakzeptanz\n& Support", value: 0, maxValue: 5 },
    
    // Unternehmenskultur quadrant (bottom-left) - clockwise
    { segment: "Sensibilisierung\n& Entwicklung", value: 0, maxValue: 5 },
    { segment: "Wissensverfügbarkeit &\nWeitergabemechanismen", value: 0, maxValue: 5 },
    { segment: "Kompetenzaufbau", value: 0, maxValue: 5 },
    { segment: "Management-\nEngagement", value: 0, maxValue: 5 },
    { segment: "Rollen &\nVerantwortlichkeiten", value: 3, maxValue: 5 },
    
    // Prozesse quadrant (top-left) - clockwise
    { segment: "Prozessdefinition &\n-dokumentation", value: 2, maxValue: 5 },
    { segment: "Schnittstellen &\nZusammenarbeit", value: 2, maxValue: 5 },
    { segment: "Prozesscontrolling &\nkontinuierliche Verbesserung", value: 1, maxValue: 5 },
    { segment: "Vorlagen/Templates", value: 0, maxValue: 5 }
  ];

  const outerLabels = [
    "Standards",
    "Tool-Unterstützung", 
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
