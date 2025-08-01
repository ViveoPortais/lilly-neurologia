"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PendingsMobilePage } from "./mobile/PendingsMobilePage";
import PendingsDesktopPage from "./desktop/PendingsDesktop";
import { Accordion } from "@/components/custom/Accordion";
import { ExamPendingModel } from "@/types/diagnostic";
import useSession from "@/hooks/useSession";
import { PendingTableColumns } from "./PendingTableColumns";
import { RenderPendingModal } from "./modals/RenderPendingModal";
import { MdTaskAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  grouped: Record<string, ExamPendingModel[]>;
  fixedCategories: string[];
}

export function GenericPendingsPage({ fixedCategories, grouped }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const auth = useSession();
  const role = auth.role as "doctor" | "operation" | "logistics" | "professional";
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<ExamPendingModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const resolveId = searchParams.get("resolveId");
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    if (!resolveId) return;

    let found: ExamPendingModel | undefined;
    let foundCategory: string | undefined;

    for (const [category, list] of Object.entries(grouped)) {
      found = list.find((item) => item.id === resolveId);
      if (found) {
        foundCategory = category;
        break;
      }
    }

    if (found && foundCategory) {
      setSelectedCategory(foundCategory);
      setSelectedItem(found);
      setHighlightCategory(foundCategory);
      setOpenCategory(foundCategory);

      
    setTimeout(() => {
      setHighlightCategory(null);
      router.replace(window.location.pathname);
    }, 2000);
    }

  }, [resolveId, categoryParam, grouped, role, router, searchParams]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      {fixedCategories.map((category) => {
        const items = grouped[category] || [];
        const columns = PendingTableColumns[role]?.[category] || [];
        const search = searchTerms[category]?.toLowerCase() || "";

        const filteredItems =
          role === "operation"
            ? items.filter((item) => {
                const valuesToSearch: string[] = [];

                for (const val of Object.values(item)) {
                  if (typeof val === "string" || typeof val === "number") {
                    valuesToSearch.push(val.toString().toLowerCase());
                  }
                }

                if (item.dateCreate) valuesToSearch.push(dayjs(item.dateCreate).format("DD/MM/YYYY"));
                if (item.dateUpdate) valuesToSearch.push(dayjs(item.dateUpdate).format("DD/MM/YYYY"));

                return valuesToSearch.some((val) => val.includes(search));
              })
            : items;

        return (
          <Accordion
            id={`accordion-${category}`}
            key={category}
            title={category}
            badgeText={`${String(items.length).padStart(2, "0")} ${isMobile ? "" : "pendentes"}`}
            className={highlightCategory === category ? "ring-2 ring-mainlilly rounded-md" : ""}
            isOpen={openCategory  === category}
            onToggle={() => setOpenCategory(prev => (prev === category ? null : category))}
          >
            {role === "operation" && (
              <div className="mb-2">
                <Input
                  icon="search"
                  inputPlaceholder="Pesquisar por palavra-chave"
                  className="!text-sm"
                  value={searchTerms[category] || ""}
                  onChange={(e) => setSearchTerms({ ...searchTerms, [category]: e.target.value })}
                />
              </div>
            )}
            {filteredItems.length > 0 ? (
              isMobile ? (
                <PendingsMobilePage
                  items={filteredItems}
                  columns={columns}
                  renderModal={(item, onClose) => (item ? <RenderPendingModal item={item} onClose={onClose} category={category} role={role} /> : null)}
                />
              ) : (
                <PendingsDesktopPage
                  items={filteredItems}
                  columns={columns}
                  renderModal={(item, onClose) => (item ? <RenderPendingModal item={item} onClose={onClose} category={category} role={role} /> : null)}
                />
              )
            ) : (
              <div className="px-4 py-2 text-sm text-zinc-500">Nenhuma pendência nesta categoria.</div>
            )}
          </Accordion>
        );
      })}

      {selectedItem && selectedCategory && (
        <RenderPendingModal
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          role={role}
        />
      )}
    </div>
  );
}