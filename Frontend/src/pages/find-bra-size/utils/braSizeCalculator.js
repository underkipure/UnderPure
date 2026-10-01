export function calculateBraSize(band, bust) {
  const bandMeasurement = parseFloat(band);
  const bustMeasurement = parseFloat(bust);
  if (isNaN(bandMeasurement) || isNaN(bustMeasurement)) return null;

  // Band size: round up to next even number
  let bandSize = Math.ceil(bandMeasurement);
  if (bandSize % 2 !== 0) bandSize += 1;

  // Cup size based on difference
  const diff = bustMeasurement - bandMeasurement;
  const cups = [
    "AA",
    "A",
    "B",
    "C",
    "D",
    "DD",
    "DDD/E",
    "F",
    "G",
    "H",
    "I",
    "J",
  ];
  const cupIndex = Math.round(diff);
  const cupSize =
    cups[Math.max(0, Math.min(cupIndex, cups.length - 1))] || "G";

  return {
    size: `${bandSize}${cupSize}`,
    bandSize,
    cupSize,
    diff: Math.round(diff),
  };
}
