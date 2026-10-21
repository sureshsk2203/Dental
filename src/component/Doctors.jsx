import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Stethoscope } from 'lucide-react'
import BookButton from './BookButton'
import './Doctors.css'

/* =====================================================
   OUR DOCTORS  (edit / add / remove doctors here)
   - photos live in  public/doctors/  and are written as "/doctors/<file name>"
   - every id must be different
   - experience: "" hides the "experience" badge on that card
   ===================================================== */
const doctors = [
  {
    id: 1,
    name: 'Dr. M. Nawin Subhaganesh',
    role: 'Pediatric & Preventive Dentist',
    qualification: 'BDS, MDS (Pediatric Dentistry)',
    experience: '5+ years',
    speciality: 'Kids & Family Dental Care',
    photo: '/doctors/dr-navin.jpeg',
  },
  {
    id: 2,
    name: 'Dr. Deepika R.M.',
    role: 'Clinical Director & Oral Pathologist',
    qualification: 'BDS, MDS (Oral Pathology)',
    experience: '5+ years',
    speciality: 'Oral Cancer & Lesion Diagnosis',
    photo: '/doctors/dr-Deepika.jpeg',
  },
  {
    id: 3,
    name: 'Dr. Sai Adithya Narayanan',
    role: 'Oral & Maxillofacial Surgeon',
    qualification: 'BDS, MDS',
    experience: '', // years not known yet, add the real number later
    speciality: 'Dental & Maxillofacial Implants',
    photo: '/doctors/dr-Sai Adithya Narayanan.jpeg',
  },
]

/* Where the face is inside each photo, so the card crop never cuts the head.
   Format: "left% top%".  New doctor? Add an id here (or leave it, "center top" is used). */
const FOCUS = {
  1: 'center 20%',
  2: 'center 12%',
  3: '18% 30%', // wide photo, face is on the left
}

// "Dr. Deepika R.M." -> "D"   |   "Dr. Sai Adithya Narayanan" -> "SA"
const initials = (name) => {
  const words = name.replace('Dr. ', '').split(' ')
  const real = words.filter((w) => !/^([A-Za-z]\.)+$/.test(w))   // skip "M." / "R.M."
  return (real.length ? real : words).map((w) => w[0]).join('').slice(0, 2)
}

/* If the exact file is not found, other extensions and folders are tried
   (for example  public/doctors/doctors/  when a zip was extracted twice). */
const EXTS = ['jpeg', 'jpg', 'png', 'webp', 'JPG', 'JPEG', 'PNG']

function photoCandidates(photo) {
  const cut = photo.lastIndexOf('/')
  const file = photo.slice(cut + 1).replace(/\.[a-z0-9]+$/i, '')
  const names = [...new Set([file, file.toLowerCase()])]
  const dirs = [...new Set([photo.slice(0, cut), '/doctors', '/doctors/doctors', '/Doctors', ''])]

  const list = [photo]
  dirs.forEach((dir) =>
    names.forEach((name) => EXTS.forEach((ext) => list.push(`${dir}/${name}.${ext}`)))
  )
  return [...new Set(list)]
}

/* photo, or the initials circle if there is no photo / the file is missing */
function DoctorPhoto({ doc }) {
  const list = useMemo(() => (doc.photo ? photoCandidates(doc.photo) : []), [doc.photo])
  const [i, setI] = useState(0)
  const [failed, setFailed] = useState(false)

  const next = () => {
    if (i + 1 < list.length) {
      setI(i + 1)
    } else {
      setFailed(true)
      if (import.meta.env.DEV) console.warn('Doctor photo not found for', doc.name, 'tried:', list)
    }
  }

  if (!doc.photo || failed) {
    return (
      <>
        <div className="doctor-initials">{initials(doc.name)}</div>
        {import.meta.env.DEV && doc.photo && (
          <small style={{ position: 'absolute', left: 12, right: 12, bottom: 12, fontSize: 12, textAlign: 'center', color: '#7a3b65' }}>
            looking for: public{doc.photo}
          </small>
        )}
      </>
    )
  }

  return (
    <img
      key={list[i]}
      src={encodeURI(list[i])}          // file names with spaces are fine
      alt={doc.name}
      loading="lazy"
      style={{ objectPosition: doc.focus || FOCUS[doc.id] || 'center top' }}
      onError={next}
    />
  )
}

export default function Doctors() {
  return (
    <div className="doctors-page">
      <section className="doctors-section" id="doctors">
        <div className="doctors-header">
          <span className="doctors-badge">
            <span className="doctors-dot" />
            OUR TEAM • SALEM
          </span>
          <h1 className="doctors-title">
            Meet Our Expert <span>Doctors.</span>
          </h1>
          <p className="doctors-desc">
            Experienced specialists who combine personalized care with modern
            dental technology, for you and your family.
          </p>
        </div>

        <div className="doctors-grid">
          {doctors.map((doc, i) => (
            <motion.article
              key={doc.id}
              className="doctor-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="doctor-photo">
                <DoctorPhoto doc={doc} />
                {doc.experience && <span className="doctor-exp">{doc.experience} experience</span>}
              </div>

              <div className="doctor-info">
                <h2 className="doctor-name">{doc.name}</h2>
                <p className="doctor-role">{doc.role}</p>

                <div className="doctor-details">
                  <p className="doctor-meta"><Award size={16} /> {doc.qualification}</p>
                  <p className="doctor-meta"><Stethoscope size={16} /> {doc.speciality}</p>
                </div>

                <BookButton doctor={doc.name} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}