import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ChevronRight, Clock, LayoutDashboard, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="px-6 py-4 border-b flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-foreground">Deadline Decider</span>
        </div>
        <Link href="/dashboard">
          <Button data-testid="link-dashboard-nav" variant="outline" className="hidden sm:flex">
            Go to Dashboard
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mb-6">
            Know exactly what's due next &mdash; no more guessing.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            A calm, organized space for your overwhelmed academic life. Bring all your scattered deadlines into one clear, prioritized view.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-md" data-testid="button-launch-cta">
              Launch Deadline Decider <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>

        {/* Problem/Solution Section */}
        <section className="w-full bg-secondary py-20 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">The Chaos</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                College students have deadlines scattered everywhere: hidden in complex syllabi, buried in emails, posted on ICON, and quickly mentioned in class announcements. It's almost impossible to know what's actually due next without opening five different tabs.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">The Clarity</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Deadline Decider brings it all together. It's a focused, student-friendly companion that instantly tells you what needs your attention right now, prioritizing your tasks into calm, actionable buckets.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl mx-auto py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Everything you need, nothing you don't.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="w-8 h-8 text-primary" />}
              title="Urgency Grouping"
              description="Automatically sorts assignments into Overdue, Due Today, Due This Week, and Later."
            />
            <FeatureCard 
              icon={<Bell className="w-8 h-8 text-primary" />}
              title="Smart Countdowns"
              description="Instantly see how many days you have left with clear countdown labels."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="w-8 h-8 text-primary" />}
              title="Course Filtering"
              description="Focus on one class at a time with simple, one-click course filters."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8 text-primary" />}
              title="Satisfying Completion"
              description="Mark assignments complete and watch them disappear from your active list."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Persistent Storage"
              description="Your data stays right here in your browser, saving securely between sessions."
            />
            <div className="flex flex-col justify-center bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-bold text-lg mb-2 text-primary">Ready to get organized?</h3>
              <Link href="/dashboard">
                <Button className="w-full mt-4" data-testid="button-feature-launch">Start Tracking</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground border-t bg-card">
        <p className="text-sm">Built for students who just want to get things done.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-start text-left space-y-4">
      <div className="p-3 bg-primary/10 rounded-xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
