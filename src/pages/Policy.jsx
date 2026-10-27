import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useTitle } from "../components/FloatingActions.jsx";
import { POLICIES } from "../data/catalog.js";
import NotFound from "./NotFound.jsx";

export default function Policy() {
  const { id } = useParams();
  const policy = POLICIES.find((p) => p.id === id);
  useTitle(policy?.title);
  if (!policy) return <NotFound />;

  return (
    <>
      <PageHeader title={policy.title} sub={policy.intro} crumbs={[{ label: "FAQs", to: "/help" }, { label: policy.title }]} />
      <div className="section-container policy-page">
        <article className="policy-body">
          {policy.sections.map((s, i) => (
            <section key={s.h}>
              <h2>{i + 1}. {s.h}</h2>
              {s.p && <p>{s.p}</p>}
              {s.list && <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </section>
          ))}
        </article>
        <aside className="policy-nav">
          <h4>Policies</h4>
          {POLICIES.map((p) => <Link key={p.id} to={`/policies/${p.id}`} className={`filter-link ${p.id === id ? "is-active" : ""}`}>{p.title}</Link>)}
          <Link to="/help#faq" className="filter-link">FAQs</Link>
        </aside>
      </div>
    </>
  );
}
