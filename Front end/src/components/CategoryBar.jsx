import { Link } from "react-router-dom";
import "./CategoryBar.css";

export default function CategoryBar() {

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Beauty", slug: "beauty" },
  { name: "Sports", slug: "sports" },
  { name: "Toys", slug: "toys" },
  { name: "Books", slug: "books" },
  { name: "Grocery", slug: "grocery" },
];



  return (
    <nav className="category-bar">
      <div className="container category-bar-inner">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/?category=${category.slug}`}
            className="category-link"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
