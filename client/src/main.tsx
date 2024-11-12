import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Search from "./pages/Search";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/movie/:id" component={Movie} />
        <Route path="/search" component={Search} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <Toaster />
    </SWRConfig>
  </StrictMode>
);
