import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AppointmentCalendar from "./pages/AppointmentCalendar";
import MedicalDocuments from "./pages/MedicalDocuments";
import Analytics from "./pages/Analytics";
import UserProfile from "./pages/UserProfile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/services"} component={Services} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/patients"} component={Patients} />
      <Route path={"/doctors"} component={Doctors} />
      <Route path={"/appointments"} component={Appointments} />
       <Route path={"/appointment-calendar"} component={AppointmentCalendar} />
      <Route path={"/medical-documents"} component={MedicalDocuments} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/medical-records"} component={MedicalRecords} />
      <Route path={"/billing"} component={Billing} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/user-profile"} component={UserProfile} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
