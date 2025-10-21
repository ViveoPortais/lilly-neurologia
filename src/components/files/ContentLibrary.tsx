import { useAppDispatch } from "@/store/hooks";
import { ContentCard } from "./ContentCard";
import { links } from "./contents";
import { fetchGetAnnotations } from "@/store/slices/manageFileSlice";
import { useEffect, useState } from "react";
import { AttachmentModel } from "@/lib/consentCache";
import { useLoading } from "@/contexts/LoadingContext";
import { AnnotationModel } from "@/types/general";
import { ContentItem } from "@/types/content";

export default function ContentLibrary() {

    const { show, hide } = useLoading();
    const dispatch = useAppDispatch();

    const [contentItems, setContentItems] = useState<ContentItem[]>([]);

    useEffect(() => {
        const load = async () => {
            show();
            const response = await dispatch(fetchGetAnnotations()).unwrap();
            const items: ContentItem[] = [];
            const annotations = Array.isArray(response) ? response : response?.data || [];
            
            annotations
                .filter((annotation: AnnotationModel) => annotation.annotationTypeStringMap?.flag === "#CONTENT_LIBRARY")
                .forEach((annotation: AnnotationModel) => {
                    annotation.attachments?.forEach((attachment, index) => {
                        items.push({
                            id: `${annotation.id}-${index}`,
                            title: annotation.name ?? '',
                            type: "pdf",
                            url: `data:${attachment.contentType};base64,${attachment.documentBody}`
                        });
                    });
                });
            setContentItems(items);
            hide();
        };

        load();
    }, [dispatch]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {contentItems.map((item) => (
                <ContentCard key={item.id} item={item} />
            ))}
            {links.map((item) => (
                <ContentCard key={item.id} item={item} />
            ))}
        </div>
    );
}
