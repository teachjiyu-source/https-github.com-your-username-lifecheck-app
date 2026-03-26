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
            name: "Synthetic Polymer Debris",
            traits: ["artificial smoothness", "hydrocarbon smell", "unnatural color"],
            explanation: "Specimen is composed of complex manufactured polymers. Material degradation suggests it is human-made wreckage or industrial waste."
        },
        {
            name: "Silicate Basalt Fragment",
            traits: ["porous texture", "high iron content", "volcanic origin"],
            explanation: "Primary composition is volcanic silicate. Micro-cavities contain no organic remnants. Specimen is a standard planetary crust fragment."
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
    // This allows different photos of the same "type" to yield consistent but varying results
    const seed = photoData ? photoData.length % 100 : Math.floor(Math.random() * 100);
    
    let classification, library;

    // 2. Determine the category based on the manual score
    if (manualScore >= 5) {
        classification = "POSSIBLY LIVING";
        library = TAXONOMY_DB.LIVING;
    } else if (manualScore >= 3) {
        // High chance of being an extinct/rare archetype if the score is mid-high
        classification = seed > 50 ? "POSSIBLY LIVING" : "UNCERTAIN";
        library = seed > 70 ? TAXONOMY_DB.EXTINCT_RARE : TAXONOMY_DB.LIVING;
    } else {
        classification = "LIKELY NON-LIVING";
        library = TAXONOMY_DB.NON_LIVING;
    }

    // 3. Pick an item from the library based on the visual seed
    const index = seed % library.length;
    const entry = library[index];

    return {
        classification: classification,
        explanation: `[INTERNAL SENSORS] ${entry.explanation} Primary ID: ${entry.name}.`
    };
}
