"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, Check,
  Box, ChevronRight, FileCheck2, FileText, Globe2, Layers3, Mail, MapPin, MessageCircle,
  Pause, Phone, Play, RotateCcw, Share2, ShieldCheck, UserRoundPlus, X
} from "lucide-react";
import { clients, company, stats, verticals, workflow } from "@/data/site";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProfileFilm } from "@/components/ProfileFilm";
import { ProfileOperations } from "@/components/ProfileOperations";
import styles from "./CompanyProfile.module.css";

const profileUrl = "https://www.aravalione.in/profile";
const phone = company.phone.replace(/[^+\d]/g, "");
const whatsapp = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello ARAVALI ONE, I viewed your company profile and would like to discuss a requirement.")}`;
const navigation = [
  { id: "profile-overview", label: "Overview" },
  { id: "profile-capabilities", label: "Capabilities" },
  { id: "profile-leadership", label: "Leadership" },
  { id: "profile-connect", label: "Connect" }
];

const profileCapabilities = [
  { ...verticals[1], image: "/profile-media/mining-crushing.webp", imageAlt: "Illustrative crusher plant processing quarry rock into graded aggregates" },
  { ...verticals[2], imageAlt: "Heavy haulage trucks and tipper fleet for infrastructure logistics" },
  { ...verticals[0], image: "/profile-media/aggregate-rail-supply.webp", imageAlt: "Illustrative rail wagons loaded with aggregate at a material-handling yard" },
  { ...verticals[4], image: "/profile-media/earthwork-execution.webp", imageAlt: "Illustrative excavation, haulage and compaction at an earthwork site" },
  { ...verticals[5], imageAlt: "Concrete mixer truck for ready-mix concrete and industrial material supply" },
  {
    title: "GSB / WMM / DBM & BC",
    description: "Road-layer material supply for GSB, WMM, DBM and BC work, aligned with project specifications and delivery schedules.",
    icon: Layers3,
    image: "/profile-media/road-layer-materials.webp",
    imageAlt: "Illustrative asphalt paving and roller compaction for road pavement layers"
  }
];

export function CompanyProfile() {
  const [intro, setIntro] = useState(true);
  const [active, setActive] = useState("profile-overview");
  const [notice, setNotice] = useState("");
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [depth, setDepth] = useState(true);
  const [filmEnabled, setFilmEnabled] = useState(false);
  const [introCycle, setIntroCycle] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(motion);
    setDepth(!motion);
    const connection = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const limited = Boolean(connection.connection?.saveData || /(^|-)2g/.test(connection.connection?.effectiveType || ""));
    setFilmEnabled(!motion && !limited);
    setPaused(motion || limited);
    if (motion) { setIntro(false); return; }
    let seen = false;
    try { seen = sessionStorage.getItem("ao-profile-intro") === "seen"; } catch {}
    if (seen && introCycle === 0) { setIntro(false); return; }
    setIntro(true);
    const timer = window.setTimeout(() => {
      setIntro(false);
      try { sessionStorage.setItem("ao-profile-intro", "seen"); } catch {}
    }, 1550);
    return () => window.clearTimeout(timer);
  }, [introCycle]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    const nodes = navigation.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-18% 0px -57% 0px", threshold: 0 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll(`.${styles.reveal}`).forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function openEnquiry() {
    triggerRef.current = document.activeElement as HTMLElement;
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
  }

  function closeEnquiry() {
    dialogRef.current?.close();
    onDialogClosed();
  }

  function onDialogClosed() {
    document.body.style.overflow = "";
    triggerRef.current?.focus();
  }

  async function shareProfile() {
    if (navigator.share) {
      try { await navigator.share({ title: company.name, text: company.tagline, url: profileUrl }); return; }
      catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(profileUrl); setNotice("Profile link copied"); }
    catch { setNotice(profileUrl); }
  }

  function toggleVideo() {
    setFilmEnabled(true);
    setPaused(value => !value);
  }

  function tiltCard(event: React.PointerEvent<HTMLElement>) {
    if (!depth || reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-x", `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(event.clientX - rect.left - rect.width / 2) / rect.width * 5}deg`);
  }

  function resetTilt(event: React.PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className={styles.profile} data-depth={depth ? "on" : "off"}>
      <a className={styles.skipLink} href="#profile-overview">Skip to company profile</a>
      {intro ? (
        <div className={styles.intro} key={introCycle} aria-label="ARAVALI ONE introduction">
          <button className={styles.introSkip} onClick={() => setIntro(false)} title="Skip introduction" aria-label="Skip introduction"><X size={19} /></button>
          <div className={styles.introIdentity}>
            <Image src="/images/aravali-one-transparent-logo.png" alt="ARAVALI ONE" width={180} height={144} priority />
            <p>{company.name}</p>
            <span>{company.groupLine}</span>
            <div className={styles.introRule}><span /></div>
            <strong>{company.tagline}</strong>
          </div>
        </div>
      ) : null}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="ARAVALI ONE main website">
            <Image src="/images/aravali-one-transparent-logo.png" alt="" width={56} height={46} priority />
            <span><strong>ARAVALI ONE</strong><small>{company.groupLine}</small></span>
          </Link>
          <div className={styles.headerActions}>
            <span className={styles.profileLabel}>COMPANY PROFILE</span>
            <button className={styles.iconButton} onClick={() => setDepth(value => !value)} title={depth ? "Turn off depth motion" : "Turn on depth motion"} aria-label={depth ? "Turn off depth motion" : "Turn on depth motion"} aria-pressed={depth}><Box size={18} /></button>
            <button className={styles.iconButton} onClick={() => setIntroCycle(value => value + 1)} title="Replay introduction" aria-label="Replay introduction"><RotateCcw size={17} /></button>
            <button className={styles.iconButton} onClick={shareProfile} title="Share company profile" aria-label="Share company profile"><Share2 size={18} /></button>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-label="ARAVALI ONE company introduction">
          <ProfileFilm motion={depth && !reduced} paused={paused} enabled={filmEnabled && !intro} onState={state => setPlaying(state.playing)} />
          <div className={styles.heroShade} />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}><span />MATERIALS. MOVEMENT. COMMITMENT.</p>
              <h1>ARAVALI <span>ONE<i>.</i></span></h1>
              <p className={styles.legalName}>PRIVATE LIMITED</p>
              <p className={styles.tagline}>{company.tagline}</p>
              <p className={styles.heroDescription}>The right material. The right movement.<br />Accountable, from source to site.</p>
              <div className={styles.heroButtons}>
                <button className={styles.lightButton} onClick={openEnquiry}>Discuss a project <ArrowUpRight size={18} /></button>
                <a className={styles.saveButton} href="/profile/contact.vcf" download><UserRoundPlus size={18} />Save contact</a>
              </div>
            </div>
            <a className={styles.heroAside} href="#profile-operations"><span>INSIDE OUR WORLD</span><p>From source.<br />To site.</p><div className={styles.asideRule} /><ArrowDown size={20} /></a>
          </div>
          <div className={styles.heroBottom}>
            <span><MapPin size={13} />Gwalior, Madhya Pradesh</span>
            <a href="#profile-overview" aria-label="Explore company profile">Explore profile <ArrowDown size={15} /></a>
            <button className={styles.filmControl} onClick={toggleVideo} title={!paused && playing ? "Pause site film" : "Play site film"} aria-label={!paused && playing ? "Pause site film" : "Play site film"}>{!paused && playing ? <Pause size={15} /> : <Play size={15} />}<span>QUARRY FILM</span></button>
          </div>
        </section>

        <nav className={styles.sectionNav} aria-label="Profile sections">
          <div className={styles.sectionNavInner}>{navigation.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? styles.activeNav : ""} aria-current={active === item.id ? "location" : undefined}>{item.label}</a>)}</div>
        </nav>

        <section id="profile-overview" className={`${styles.section} ${styles.overview}`}>
          <div className={`${styles.sectionInner} ${styles.reveal}`}>
            <div className={styles.sectionHeading}><span className={styles.eyebrow}>01 / WHO WE ARE</span><h2>A strong foundation.<br /><span>A disciplined approach.</span></h2></div>
            <div className={styles.overviewCopy}><p>ARAVALI ONE PRIVATE LIMITED, a unit of Aravali India, brings material supply, mining-linked operations and infrastructure logistics together.</p><p>We work through controlled sourcing, planned dispatch and accurate documentation, so every requirement has a clear path from source to site.</p><div className={styles.principles}><span><ShieldCheck size={17} />Compliance first</span><span><FileCheck2 size={17} />Documentation led</span></div></div>
          </div>
          <div className={styles.numbers}>{[stats[2], stats[0], stats[1]].map(item => {
            const [amount, ...unit] = item.value.split(" ");
            return <div key={item.label}><strong>{amount}{unit.length ? <small>{unit.join(" ")}</small> : null}</strong><span>{item.label}</span></div>;
          })}</div>
        </section>

        <ProfileOperations motion={depth && !reduced} paused={paused} enabled={filmEnabled && !intro} onTogglePlayback={toggleVideo} onEnquire={openEnquiry} />

        <section id="profile-capabilities" className={`${styles.section} ${styles.capabilities}`}>
          <div className={styles.sectionInner}>
            <div className={`${styles.wideHeading} ${styles.reveal}`}><div><span className={styles.eyebrow}>02 / WHAT WE DO</span><h2>One partner.<br /><span>Six connected capabilities.</span></h2></div><p>Materials and movement for roads, railways, industrial works and ambitious infrastructure projects.</p></div>
            <div className={styles.verticalGrid}>{profileCapabilities.map((vertical, index) => {
              const Icon = vertical.icon;
              return <article className={`${styles.vertical} ${styles.reveal}`} key={vertical.title} onPointerMove={tiltCard} onPointerLeave={resetTilt}>
                <div className={styles.verticalImage}><Image src={vertical.image} alt={vertical.imageAlt} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 50vw, 33vw" /><span>0{index + 1}</span></div>
                <div className={styles.verticalText}><Icon size={20} strokeWidth={1.5} /><h3>{vertical.title}</h3><p>{vertical.description}</p></div>
              </article>;
            })}</div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.assurance}`}>
          <div className={styles.sectionInner}>
            <div className={`${styles.wideHeading} ${styles.reveal}`}><div><span className={styles.eyebrow}>THE ARAVALI ONE STANDARD</span><h2>Every tonne.<br /><span>Every record. Every detail.</span></h2></div><p>A source-to-site workflow that keeps execution visible and documentation accountable.</p></div>
            <ol className={styles.workflow}>{workflow.map((step,index) => <li key={step.title}><span>0{index+1}</span><h3>{step.title}</h3><ChevronRight size={16} aria-hidden /></li>)}</ol>
          </div>
        </section>

        <section className={`${styles.section} ${styles.clients}`}>
          <div className={styles.sectionInner}><span className={styles.eyebrow}>PROJECTS &amp; CLIENTS</span><h2>Working with infrastructure teams.</h2><div className={styles.clientNames}>{clients.map(client => <span key={client.name}>{client.name}</span>)}</div></div>
        </section>

        <section id="profile-leadership" className={`${styles.section} ${styles.leadership}`}>
          <div className={`${styles.sectionInner} ${styles.leadershipGrid} ${styles.reveal}`}>
            <div className={styles.leaderImage}><Image src="/images/director-anshul-goyal.webp" alt="Anshul Goyal, Founder and Director" width={840} height={973} sizes="(max-width: 700px) 220px, 280px" /></div>
            <div className={styles.leaderCopy}>
              <span className={styles.eyebrow}>FOUNDER &amp; DIRECTOR</span>
              <h2>Anshul Goyal</h2>
              <p>Mr. Anshul Goyal leads ARAVALI ONE PRIVATE LIMITED with a hands-on focus on client needs, operational coordination and technology-enabled business processes.</p>
              <p>His approach brings project requirements and on-ground operations into a practical, responsive working relationship.</p>
            </div>
          </div>
          <ul className={styles.leadershipValues} aria-label="Leadership values">{["Integrity", "Service", "Quality", "Accountability"].map((value, index) => <li key={value}>{value}{index < 3 ? <span aria-hidden="true">/</span> : null}</li>)}</ul>
        </section>

        <section id="profile-connect" className={`${styles.section} ${styles.connect}`}>
          <div className={`${styles.sectionInner} ${styles.connectGrid}`}>
            <div><span className={styles.eyebrow}>04 / LET&apos;S CONNECT</span><h2>Your next project.<br /><span>Our next commitment.</span></h2><p>Tell us the material, location and timeline.<br />We will take the conversation forward.</p><button className={styles.darkButton} onClick={openEnquiry}>Send a project enquiry <ArrowRight size={18} /></button></div>
            <div className={styles.contactDetails}>
              <a href={`tel:${phone}`}><span className={styles.contactIcon}><Phone size={20} /></span><span><small>CALL US</small><strong>{company.phone}</strong></span><ArrowUpRight size={18} /></a>
              <a href={`mailto:${company.email}`}><span className={styles.contactIcon}><Mail size={20} /></span><span><small>EMAIL</small><strong>{company.email}</strong></span><ArrowUpRight size={18} /></a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.registeredOffice)}`} target="_blank" rel="noreferrer"><span className={styles.contactIcon}><MapPin size={20} /></span><span><small>OFFICE ADDRESS</small><strong>{company.registeredOffice}</strong></span><ArrowUpRight size={18} /></a>
            </div>
          </div>
          <div className={styles.resourceLinks}><a href="/downloads/aravali-one-company-profile.pdf" download><FileText size={18} /><span>Company profile PDF</span><ArrowDownToLine size={17} /></a><Link href="/"><Globe2 size={18} /><span>Explore the full website</span><ArrowUpRight size={17} /></Link></div>
        </section>

        <footer className={styles.footer}><div><strong>{company.name}</strong><span>{company.groupLine} / {company.tagline}</span></div><p>CIN {company.cin}<br />GSTIN {company.gstin}</p><span>aravalione.in</span></footer>
      </main>

      <div className={styles.actionDock} aria-label="Quick contact actions"><div className={styles.dockInner}><span className={styles.dockIdentity}>ARAVALI ONE<span>Let&apos;s get to work.</span></span><a href={`tel:${phone}`}><Phone size={18} /><span>Call</span></a><a className={styles.whatsappAction} href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>WhatsApp</span></a><button onClick={openEnquiry}><ArrowUpRight size={20} /><span>Enquire</span></button></div></div>

      <dialog className={styles.enquiryDialog} ref={dialogRef} onClose={onDialogClosed} onCancel={onDialogClosed} onClick={event => { if (event.target === event.currentTarget) closeEnquiry(); }} aria-labelledby="profile-enquiry-title">
        <div className={styles.dialogHeader}><div><span className={styles.eyebrow}>PROJECT ENQUIRY</span><h2 id="profile-enquiry-title">Let&apos;s build together.</h2></div><button ref={closeRef} className={styles.iconButton} onClick={closeEnquiry} aria-label="Close enquiry" title="Close enquiry"><X size={21} /></button></div>
        <div className={styles.dialogBody}><EnquiryForm /></div>
      </dialog>
      <div className={`${styles.toast} ${notice ? styles.showToast : ""}`} role="status"><Check size={17} /><span>{notice}</span></div>
    </div>
  );
}
