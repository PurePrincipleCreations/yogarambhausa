import kaliYogaImage from "@/assets/course-kali-yoga.jpg";
import vinyasaFlowImage from "@/assets/course-vinyasa-flow.jpg";
import yogaStrengthImage from "@/assets/course-yoga-strength.jpg";
import yogaBeginnersImage from "@/assets/course-yoga-beginners.jpg";
import mahamokshaImage from "@/assets/course-mahamoksha.jpg";
import pranayamaImage from "@/assets/course-pranayama.jpg";
import formFactorImage from "@/assets/course-form-factor.jpg";
import movementMechanicsImage from "@/assets/course-movement-mechanics.jpg";
import stillnessFlowImage from "@/assets/course-stillness-flow.jpg";

export type CourseVideo = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  thumbnail: string;
  /** YouTube id used for the silent hover preview on the catalog card. */
  previewVideoId?: string;
  trailerUrl: string;
  category: "Yoga" | "Movement Mechanics" | "Flow";
  videos: CourseVideo[];
};

const previewUrl = "https://www.youtube.com/embed/ScMzIvxBSi4";
const lessonUrl = "https://www.youtube.com/embed/ysz5S6PUM-U";

function playlist(slug: string, titles: Array<[string, string]>): CourseVideo[] {
  return titles.map(([title, duration], index) => ({
    id: `${slug}-${index + 1}`,
    title,
    duration,
    videoUrl: lessonUrl,
  }));
}

function youtubePlaylist(slug: string, items: Array<[string, string]>): CourseVideo[] {
  return items.map(([title, videoId], index) => ({
    id: `${slug}-${index + 1}`,
    title,
    duration: "Full class",
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
  }));
}


export const courses: Course[] = [
  {
    id: "course-kali-yoga",
    title: "Kali Yoga",
    slug: "kali-yoga",
    price: 149,
    category: "Yoga",
    description:
      "A fierce, embodied practice that channels grounded strength into fluid expression. Build focus, resilience, and a deeper relationship with your instinctive intelligence.",
    thumbnail: kaliYogaImage,
    trailerUrl: previewUrl,
    videos: playlist("kali-yoga", [
      ["Entering the Practice", "12:40"], ["Rooting Through the Feet", "18:15"],
      ["Strength of the Spine", "22:30"], ["Rhythm and Release", "16:45"],
      ["The Kali Sequence", "34:10"], ["Integration", "11:20"],
    ]),
  },
  {
    id: "course-vinyasa-flow",
    title: "Vinyasa Flow",
    slug: "vinyasa-flow",
    price: 129,
    category: "Flow",
    description:
      "Move with precision through intelligently sequenced, breath-led practices. Each class develops grace, stamina, and an effortless quality of attention.",
    thumbnail: vinyasaFlowImage,
    trailerUrl: previewUrl,
    videos: playlist("vinyasa-flow", [
      ["The Architecture of Flow", "14:00"], ["Breath as Metronome", "19:30"],
      ["Spinal Waves", "21:10"], ["Standing Mandala", "28:20"],
      ["Creative Transitions", "25:45"], ["Complete Flow", "42:00"],
    ]),
  },
  {
    id: "course-yoga-strength",
    title: "Yoga for Strength",
    slug: "yoga-for-strength",
    price: 159,
    category: "Yoga",
    description:
      "Progressive strength work meets the intelligence of traditional asana. Develop durable joints, steady control, and power that serves every movement practice.",
    thumbnail: yogaStrengthImage,
    trailerUrl: previewUrl,
    videos: playlist("yoga-strength", [
      ["Foundations of Tension", "15:20"], ["Core as Connection", "24:10"],
      ["Shoulder Integrity", "20:35"], ["Strong Standing", "27:00"],
      ["Arm Balance Foundations", "31:15"], ["Full Strength Practice", "45:30"],
    ]),
  },
  {
    id: "course-yoga-beginners",
    title: "Yoga for Beginners",
    slug: "yoga-for-beginners",
    price: 99,
    category: "Yoga",
    description:
      "A clear, welcoming introduction to yoga without assumptions or overwhelm. Learn essential shapes, breath cues, and modifications at a pace that builds confidence.",
    thumbnail: yogaBeginnersImage,
    trailerUrl: previewUrl,
    videos: playlist("yoga-beginners", [
      ["Your First Practice", "13:00"], ["Breathing Naturally", "11:45"],
      ["Standing Essentials", "19:20"], ["Healthy Hips", "22:10"],
      ["A Gentle Sun Sequence", "26:30"], ["Rest and Restore", "17:15"],
    ]),
  },
  {
    id: "course-mahamoksha",
    title: "Mahamoksha Sadhana",
    slug: "mahamoksha-sadhana",
    price: 189,
    category: "Yoga",
    description:
      "An immersive inner practice drawing together mantra, meditation, and subtle-body awareness. Enter a disciplined ritual designed to refine perception and deepen stillness.",
    thumbnail: mahamokshaImage,
    trailerUrl: previewUrl,
    videos: playlist("mahamoksha", [
      ["Preparing the Inner Space", "16:40"], ["The Seat and the Gaze", "21:00"],
      ["Mantra as Movement", "24:15"], ["Subtle Body Map", "29:30"],
      ["Mahamoksha Practice I", "38:00"], ["Mahamoksha Practice II", "44:20"],
      ["Closing Contemplation", "12:15"],
    ]),
  },
  {
    id: "course-pranayama",
    title: "Pranayama",
    slug: "pranayama",
    price: 119,
    category: "Yoga",
    description:
      "Study the mechanics and energetic dimensions of classical breathwork. Build a safe, progressive practice for calm focus, vitality, and nervous-system balance.",
    thumbnail: pranayamaImage,
    trailerUrl: previewUrl,
    videos: playlist("pranayama", [
      ["Meeting the Breath", "10:30"], ["Anatomy of Respiration", "18:45"],
      ["Sama Vritti", "15:00"], ["Nadi Shodhana", "21:20"],
      ["Ujjayi and Bandha", "24:10"], ["Integrated Practice", "32:30"],
    ]),
  },
  {
    id: "course-form-factor",
    title: "Form Factor",
    slug: "form-factor",
    price: 139,
    category: "Movement Mechanics",
    description:
      "Explore how shape, leverage, and intention transform human movement. Learn to read your own form and create efficient patterns without sacrificing expression.",
    thumbnail: formFactorImage,
    trailerUrl: previewUrl,
    videos: playlist("form-factor", [
      ["Form Is Information", "13:50"], ["Lines of Force", "20:15"],
      ["Leverage and Load", "25:00"], ["Spirals in Motion", "22:40"],
      ["Shape Transitions", "29:10"], ["Applied Form Lab", "36:25"],
    ]),
  },
  {
    id: "course-movement-mechanics",
    title: "Movement Mechanics",
    slug: "movement-mechanics",
    price: 169,
    category: "Movement Mechanics",
    description:
      "Understand the practical anatomy behind strong, sustainable movement. Translate biomechanics into usable cues for mobility, coordination, and long-term joint health.",
    thumbnail: movementMechanicsImage,
    trailerUrl: previewUrl,
    videos: playlist("movement-mechanics", [
      ["The Moving Skeleton", "17:10"], ["Joint by Joint", "26:30"],
      ["Ground Reaction", "21:45"], ["Locomotion Patterns", "30:00"],
      ["Rotation and Reach", "24:20"], ["Movement Assessment", "33:15"],
      ["Building Your Practice", "28:40"],
    ]),
  },
  {
    id: "course-stillness-flow",
    title: "Stillness Flow",
    slug: "stillness-flow",
    price: 129,
    category: "Flow",
    description:
      "A meditative movement series where unhurried transitions reveal profound detail. Cultivate softness, control, and the capacity to remain present inside change.",
    thumbnail: stillnessFlowImage,
    trailerUrl: previewUrl,
    videos: playlist("stillness-flow", [
      ["The Pace of Attention", "14:20"], ["Yielding to Gravity", "19:10"],
      ["Floorwork Language", "25:35"], ["Suspension and Pause", "23:20"],
      ["The Long Exhale", "18:50"], ["Stillness Flow Practice", "41:10"],
    ]),
  },
];