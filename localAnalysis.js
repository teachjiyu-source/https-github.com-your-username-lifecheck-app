/**
 * Universal Taxonomy Library & Local Diagnostic Engine
 * Provides offline morphological analysis for the Life Scanner.
 */

const TAXONOMY_DB = {
    LIVING: [
        {
            name: "Carbon-Chain Multicellular",
            traits: ["bilateral symmetry", "fibrous tissue", "respiratory markers"],
            explanation: "Internal sensors detect complex carbon-chain polymers consistent with multicellular biological architecture. Respiration cycles appear active."
        },
        {
            name: "Extremophile Micro-Organism",
            traits: ["high durability", "unusual metabolic markers", "rapid replication"],
            explanation: "Specimen exhibits extreme environmental resistance. Metabolic signatures suggest a non-standard oxidation-reduction cycle."
        },
        {
            name: "Photosynthetic Flora",
            traits: ["chlorophyll markers", "rigid cell walls", "slow response"],
            explanation: "Radiometric scanning indicates high concentrations of energy-harvesting pigments. Biological structure follows standard botanical patterns."
        },
        {
            name: "Fungal Mycelial Network",
            traits: ["branching filaments", "spore production", "heterotrophic markers"],
            explanation: "Sensor array identifies a dense network of chitinous filaments. The specimen appears to be absorbing nutrients from its substrate."
        }
    ],
    EXTINCT_RARE: [
        {
            name: "Vestigial Proto-Avian",
            traits: ["segmented chitin", "primitive plumage", "hollow bone structure"],
            explanation: "Scanning matches prehistoric avian-reptile transitional markers. Morphology suggests a lineage thought extinct for 65 million standard years."
        },
        {
            name: "Trilobite-Archetype Arthropod",
            traits: ["triple-lobed carapace", "compound ocular sensors", "calcified exoskeleton"],
            explanation: "Specimen represents a highly evolved variation of the Paleozoic trilobite class. Protective plating density is exceptional."
        },
        {
            name: "Rare Bioluminescent Cnidarian",
            traits: ["radial symmetry", "phosphorescence", "gelatinous membrane"],
            explanation: "Extremely rare aquatic-derived lifeform detected. Photochemical reactions in the epidermis suggest deep-sea or subterranean evolution."
        }
    ],
    NON_LIVING: [
        {
            name: "Crystalline Mineral Formation",
            traits: ["geometric precision", "no metabolic heat", "ionic lattice"],
            explanation: "Internal structure follows a repeating geometric lattice. No thermal fluctuations or gas exchanges detected. Geological origin confirmed."
        },
        {
            name: "Silicate Basalt Fragment",
            traits: ["porous texture", "high iron content", "volcanic origin"],
            explanation: "Primary composition is volcanic silicate. Specimen is a standard planetary crust fragment."
        }
    ],
    TECHNOLOGICAL: [
        {
            name: "Artificial Computation Device",
            traits: ["synthetic polymers", "electronic circuitry", "laser/optical sensors"],
            explanation: "Scanning reveals complex micro-circuitry and synthetic polymers. Specimen matches archetypes for an optical input or computation device."
        },
        {
            name: "Mechanical Interface Component",
            traits: ["high precision parts", "metal/plastic hybrid", "ergonomic design"],
            explanation: "Analysis indicates a manufactured object designed for physical interaction. Non-organic origin. High probability of being a peripheral tool."
        }
    ]
};

/**
 * Analyzes visual complexity and manual score to return a classification.
 * @param {string} photoData - Base64 image data
 * @param {number} manualScore - Score from 0-6
 * @returns {Object} { classification, explanation }
 */
export function analyzeSpecimenLocally(photoData, manualScore) {
    // 1. Calculate a "Visual Seed" from the photoData string length and content
    const seed = photoData ? photoData.length % 100 : Math.floor(Math.random() * 100);
    
    let classification, library;

    // 2. Determine the category based on the manual score
    if (manualScore >= 5) {
        classification = "POSSIBLY LIVING";
        library = TAXONOMY_DB.LIVING;
    } else if (manualScore >= 3) {
        classification = seed > 50 ? "POSSIBLY LIVING" : "UNCERTAIN";
        library = seed > 70 ? TAXONOMY_DB.EXTINCT_RARE : TAXONOMY_DB.LIVING;
    } else if (manualScore > 0) {
        classification = "LIKELY NON-LIVING";
        library = TAXONOMY_DB.NON_LIVING;
    } else {
        // Score is 0: Assume Technological or Geological depending on "complexity"
        classification = "LIKELY NON-LIVING";
        library = seed > 40 ? TAXONOMY_DB.TECHNOLOGICAL : TAXONOMY_DB.NON_LIVING;
    }

    // 3. Pick an item from the library based on the visual seed
    const index = seed % library.length;
    const entry = library[index];

    return {
        classification: classification,
        explanation: `[INTERNAL SENSORS] ${entry.explanation} Primary ID: ${entry.name}.`
    };
}
