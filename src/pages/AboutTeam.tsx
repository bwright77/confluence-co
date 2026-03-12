import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useReducedMotion } from '../hooks/useReducedMotion'

// TODO: Download photos and move to src/assets/team/
const SHANE = {
  name: 'Shane Wright',
  title: 'Executive Director',
  photo: 'https://confluenceco.org/wp-content/uploads/2025/02/shane-216x300.png',
  bio: 'Shane Wright is a husband and father who lives in West Colfax, Denver, Colorado, who came of age guiding rivers and mountains in Colorado and Washington State. With a Masters in Nonprofit Management from Regis University and an undergraduate degree in Sociology from Western State College of Colorado "where champions are made out of thin air", Shane has over 15 years of experience raising money and building programs for youth, nature, and his community. When he is not working on community-based environmental projects, he loves to spend time with his wife Erin, their three boys, Aidan, Noah, and Griffin, and their dog Ruby.',
}

interface BoardMember {
  name: string
  photo: string
  bio: string
}

const BOARD: BoardMember[] = [
  {
    name: 'Camiliano Juarez',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/0_26_200_200_cam_juarez-768x822.png',
    bio: 'As a native of Southern Arizona, Cam grew up where the Colorado River should meet the sea. He is an experienced program coordinator with a passion for people and parks.',
  },
  {
    name: 'Dennis Chestnut',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/35_0_200_200_dennis_chestnut-768x695.png',
    bio: 'Dennis is a river hero. As a retired master carpenter, educator, and executive director his dedication to youth development, community improvement, and civic duty has led to his involvement with many civic and conservation projects.',
  },
  {
    name: 'Beverly Grant',
    photo: 'https://confluenceco.org/wp-content/uploads/2022/08/8_0_200_200_beverly_grant-768x698.jpg',
    bio: "Founder and Director of Mo' Betta Greens Marketplace, Ms. Beverly Grant is a Denver native and social justice advocate. Beverly has been nourishing, educating, and serving the community since 2010.",
  },
  {
    name: 'Makalah Emanuel',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/makalah.jpeg',
    bio: 'Makalah is an entrepreneur and communications specialist, currently serving as the Media Relations Manager for the Denver Nuggets. As a youth, Makalah participated in community-based environmental work and has developed into a leader for teams serving the community.',
  },
  {
    name: 'Roy Kady',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/197_213_200_199.55752212389_roy-kady-768x1158.webp',
    bio: 'Roy is an established sheep herder and weaver on the Diné Reservation in Northern Arizona. Roy grew up along the banks of the San Juan River and is an avid environmentalist as the sacred songs of creation depict.',
  },
  {
    name: 'Vivian Cervantes',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/0_169_200_200_vivian_cervantes.png',
    bio: 'Vivian has cultivated a passion for serving her community through multiple non-profit roles. She works to serve her community using the lens of environment, youth empowerment, and impactful partnership building.',
  },
  {
    name: 'Kirby Wright',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/02/281_133_200_200_kirby_wright-768x576.jpg',
    bio: 'Kirby is a retired attorney who lives along the banks of the Arkansas River. Previously he served as corporate counsel for a Fortune 500 international environmental engineering construction firm.',
  },
  {
    name: 'David Lopez',
    photo: 'https://confluenceco.org/wp-content/uploads/2025/03/david_lopez.jpg',
    bio: 'David, born in Mexico and brought to Colorado at a young age, is a passionate educator and leader. David works tirelessly to cultivate youth leaders, emphasizing the importance of education and outdoor experiences in shaping their futures.',
  },
]

export default function AboutTeam() {
  const [boardRef, boardInView] = useInView<HTMLDivElement>({ threshold: 0.05 })
  const reduced = useReducedMotion()

  return (
    <>
      {/* Page hero */}
      <section className="bg-cc-navy text-white pt-32 pb-20">
        <div className="container-site">
          <p className="font-display font-semibold uppercase tracking-poster text-cc-sky text-xs md:text-sm mb-4">
            Team &amp; Board
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white max-w-2xl">
            The People Behind the Work
          </h1>
        </div>
      </section>

      {/* Executive Director */}
      <section className="section-pad bg-white" aria-labelledby="ed-heading">
        <div className="container-site">
          <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-10">
            Executive Director
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-cc-sand">
                <img
                  src={SHANE.photo}
                  alt={SHANE.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <h2
                id="ed-heading"
                className="heading-display text-3xl md:text-4xl text-cc-navy mb-1"
              >
                {SHANE.name}
              </h2>
              <p className="font-display font-semibold uppercase tracking-display text-cc-sky text-sm mb-6">
                {SHANE.title}
              </p>
              <p className="font-body text-cc-stone text-base md:text-lg leading-relaxed">
                {SHANE.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="section-pad bg-cc-sand" aria-labelledby="board-heading">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="font-display font-semibold uppercase tracking-poster text-cc-orange text-xs md:text-sm mb-3">
              Leadership
            </p>
            <h2
              id="board-heading"
              className="heading-display text-3xl md:text-4xl text-cc-navy"
            >
              Board of Directors
            </h2>
          </div>

          <div
            ref={boardRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {BOARD.map((member, i) => (
              <motion.div
                key={member.name}
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                animate={boardInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="flex flex-col"
              >
                <div className="w-full aspect-square overflow-hidden rounded-lg bg-cc-navy/10 mb-4">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="font-display font-bold uppercase tracking-display text-cc-navy text-base mb-1">
                  {member.name}
                </h3>
                <p className="font-body text-cc-stone text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
