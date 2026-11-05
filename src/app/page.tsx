import ChatWidget from "@/components/ChatWidget";
import AppointmentForm from "@/components/AppointmentForm";
const features = [
  {
    icon: "✦",
    title: "AI Healthcare Assistant",
    description:
      "Get instant answers to common hospital enquiries with our intelligent AI assistant.",
  },
  {
    icon: "📅",
    title: "Easy Appointment Requests",
    description:
      "Request appointments with doctors without waiting in long reception queues.",
  },
  {
    icon: "⚡",
    title: "Smart Automation",
    description:
      "Automate patient enquiries and simplify everyday hospital operations.",
  },
];

const services = [
  { name: "Cardiology", detail: "Heart health and cardiac care", icon: "♡" },
  { name: "Neurology", detail: "Brain and nervous system care", icon: "✧" },
  { name: "Orthopedics", detail: "Bone and joint care", icon: "✚" },
  { name: "General Medicine", detail: "Everyday healthcare support", icon: "＋" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">
              MediFlow<span className="text-blue-600"> AI</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#doctors" className="hover:text-blue-600">Specialities</a>
            <a href="#about" className="hover:text-blue-600">About</a>
          </div>

          <a
            href="#assistant"
            className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try AI Assistant →
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Smarter Healthcare Starts Here
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Healthcare made
              <span className="block text-blue-600">simpler with AI.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Meet MediFlow AI, your smart healthcare assistant. Get hospital
              information, explore medical specialities and request doctor
              appointments with ease.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#assistant"
                className="rounded-full bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Explore AI Assistant →
              </a>
              <a
                href="#features"
                className="rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="mt-1 text-sm text-slate-500">AI assistance</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">Smart</p>
                <p className="mt-1 text-sm text-slate-500">Appointment requests</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">Simple</p>
                <p className="mt-1 text-sm text-slate-500">Patient experience</p>
              </div>
            </div>
          </div>

          {/* Healthcare illustration */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="relative rounded-3xl border border-blue-100 bg-white p-7 shadow-2xl shadow-blue-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    MEDIFLOW AI
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Your Health Assistant</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
                  ✦
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-100 p-4">
                  <p className="text-xs font-semibold text-blue-600">
                    MEDIFLOW AI
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Hello! Welcome to MediFlow AI. How can I help you today?
                  </p>
                </div>

                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 p-4 text-white">
                  <p className="text-sm">
                    I want to book an appointment with a cardiologist.
                  </p>
                </div>

                <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-100 p-4">
                  <p className="text-xs font-semibold text-blue-600">
                    MEDIFLOW AI
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Of course! I can help you request an appointment. Let's
                    collect a few details to get started.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between rounded-full border border-slate-200 px-5 py-4">
                <span className="text-sm text-slate-400">
                  Ask me anything...
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  ↑
                </span>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                AI-generated assistance • Not a substitute for medical advice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-600">
            Our Features
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Healthcare operations, made smarter
          </h2>
          <p className="mt-4 leading-7 text-slate-500">
            Technology and AI working together to simplify the patient
            experience and reduce repetitive hospital tasks.
          </p>
        </div>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialities */}
      <section id="doctors" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-blue-600">
              Healthcare Services
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Explore Medical Specialities
            </h2>
            <p className="mt-4 text-slate-500">
              Find the right department for your healthcare needs.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-600">
                  {service.icon}
                </div>
                <h3 className="mt-5 font-bold">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {service.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant call to action */}
      <section id="assistant" className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-blue-600 px-8 py-16 text-center text-white shadow-xl shadow-blue-200 md:px-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
            ✦
          </div>
          <h2 className="mt-7 text-3xl font-bold md:text-4xl">
            Need help with your healthcare enquiries?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Our AI assistant will help you find hospital information and
            submit appointment requests in a simple way.
          </p>
          <a
            href="mailto:hello@mediflow.example"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Contact Our Team →
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-bold">
              MediFlow<span className="text-blue-600"> AI</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Smarter healthcare through intelligent automation.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 MediFlow AI. Academic demonstration project.
          </p>
        </div>
      </section>
         {/* Floating AI Chatbot */}
      <ChatWidget />
      <AppointmentForm />
    </main>
  );
}
