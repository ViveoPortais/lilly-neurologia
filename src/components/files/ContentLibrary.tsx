import { ContentCard } from "./ContentCard";
import { contents } from "./contents";

export default function ContentLibrary() {
 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
   {contents.map((item) => (
    <ContentCard key={item.id} item={item} />
   ))}
  </div>
 );
}
